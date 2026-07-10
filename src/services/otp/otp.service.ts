import { FirebaseProvider } from './firebase.provider';
import { IOtpService, SendOtpOptions } from './otp.interface';

// Constants for rate limiting
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes

interface RateLimitData {
  attempts: number;
  lastSentAt: number;
  lockedUntil: number | null;
}

export class OtpService implements IOtpService {
  private provider: IOtpService;

  constructor() {
    // We use the Firebase Provider as our default OTP provider
    this.provider = new FirebaseProvider();
  }

  async sendOtp(options: SendOtpOptions): Promise<void> {
    const rateLimit = this.getRateLimitData(options.phoneNumber);
    const now = Date.now();

    // Check lockout
    if (rateLimit.lockedUntil && now < rateLimit.lockedUntil) {
      const remainingMinutes = Math.ceil((rateLimit.lockedUntil - now) / 60000);
      throw new Error(`تم حظر المحاولات مؤقتاً. يرجى المحاولة بعد ${remainingMinutes} دقيقة.`);
    }

    // Check cooldown (only apply cooldown if an attempt was made before)
    if (rateLimit.attempts > 0 && (now - rateLimit.lastSentAt) < RESEND_COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((RESEND_COOLDOWN_MS - (now - rateLimit.lastSentAt)) / 1000);
      throw new Error(`يرجى الانتظار ${remainingSeconds} ثانية قبل إعادة الإرسال.`);
    }

    try {
      // Delegate to provider
      await this.provider.sendOtp(options);

      // Update rate limit on success
      this.recordAttempt(options.phoneNumber, rateLimit, now);
    } catch (error: any) {
      console.error('OTP Send Error:', error);
      
      // Handle Firebase specific errors
      if (error.code === 'auth/too-many-requests') {
        throw new Error('تم تجاوز الحد المسموح به من الطلبات. يرجى المحاولة لاحقاً.');
      } else if (error.code === 'auth/invalid-phone-number') {
        throw new Error('رقم الهاتف غير صالح.');
      }
      throw error;
    }
  }

  async verifyOtp(code: string): Promise<string> {
    return this.provider.verifyOtp(code);
  }

  reset(): void {
    this.provider.reset();
  }

  // --- Rate Limiting Logic Using LocalStorage ---
  private getStorageKey(phoneNumber: string) {
    return `otp_rate_limit_${phoneNumber}`;
  }

  private getRateLimitData(phoneNumber: string): RateLimitData {
    if (typeof window === 'undefined') {
      return { attempts: 0, lastSentAt: 0, lockedUntil: null };
    }
    const stored = localStorage.getItem(this.getStorageKey(phoneNumber));
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Ignore parse error
      }
    }
    return { attempts: 0, lastSentAt: 0, lockedUntil: null };
  }

  private recordAttempt(phoneNumber: string, data: RateLimitData, now: number) {
    if (typeof window === 'undefined') return;

    let newAttempts = data.attempts + 1;
    let lockedUntil = null;

    if (newAttempts >= MAX_ATTEMPTS) {
      lockedUntil = now + LOCKOUT_DURATION_MS;
      newAttempts = 0; // reset attempts after lockout starts
    }

    const newData: RateLimitData = {
      attempts: newAttempts,
      lastSentAt: now,
      lockedUntil,
    };

    localStorage.setItem(this.getStorageKey(phoneNumber), JSON.stringify(newData));
  }
}

export const otpService = new OtpService();
