export interface SendMailOptions {
  to: string;
  subject: string;
  templateName?: string;
  context?: Record<string, any>;
  html?: string;
}

export interface MailProvider {
  sendMail(options: SendMailOptions): Promise<void>;
}
