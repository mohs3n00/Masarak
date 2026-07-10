import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { IOtpService, SendOtpOptions } from './otp.interface';

export class FirebaseProvider implements IOtpService {
  private confirmationResult: ConfirmationResult | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  async sendOtp(options: SendOtpOptions): Promise<void> {
    try {
      this.reset();
      
      // Initialize reCAPTCHA
      this.recaptchaVerifier = new RecaptchaVerifier(auth, options.containerId, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved - allow signInWithPhoneNumber.
        },
      });

      // Send SMS
      this.confirmationResult = await signInWithPhoneNumber(
        auth, 
        options.phoneNumber, 
        this.recaptchaVerifier
      );
      
    } catch (error) {
      this.reset();
      throw error;
    }
  }

  async verifyOtp(code: string): Promise<string> {
    if (!this.confirmationResult) {
      throw new Error('No OTP sent yet or session expired. Please resend the code.');
    }

    try {
      const result = await this.confirmationResult.confirm(code);
      const user = result.user;
      
      // Get the ID token to send to the backend
      const idToken = await user.getIdToken(true);
      return idToken;
    } catch (error) {
      throw new Error('الكود المدخل غير صحيح أو انتهت صلاحيته.');
    }
  }

  reset(): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    this.confirmationResult = null;
  }
}
