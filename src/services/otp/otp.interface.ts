export interface SendOtpOptions {
  phoneNumber: string;
  containerId: string;
}

export interface IOtpService {
  /**
   * Sends an OTP to the given phone number.
   * Resolves when the SMS is sent.
   */
  sendOtp(options: SendOtpOptions): Promise<void>;

  /**
   * Verifies the OTP code entered by the user.
   * Returns a token (like Firebase ID Token) that can be sent to the backend.
   */
  verifyOtp(code: string): Promise<string>;

  /**
   * Resets the verifier instance (e.g. Recaptcha) if needed
   */
  reset(): void;
}
