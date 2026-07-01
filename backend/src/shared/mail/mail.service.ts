import { Injectable, Inject } from '@nestjs/common';
import type { MailProvider } from './mail.interface';
import { SendMailOptions } from './mail.interface';
import { MailException } from './exceptions/mail.exception';

@Injectable()
export class MailService {
  constructor(
    @Inject('MAIL_PROVIDER') private readonly mailProvider: MailProvider,
  ) {}

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    return this.mailProvider.sendMail({
      to,
      subject: 'Welcome to Masarak!',
      templateName: 'welcome',
      context: { name },
    });
  }

  async sendPasswordReset(to: string, resetLink: string): Promise<void> {
    return this.mailProvider.sendMail({
      to,
      subject: 'Password Reset Request',
      templateName: 'reset-password',
      context: { resetLink },
    });
  }

  async sendEmailVerification(
    to: string,
    verificationLink: string,
  ): Promise<void> {
    return this.mailProvider.sendMail({
      to,
      subject: 'Verify Your Email',
      templateName: 'verify-email',
      context: { verificationLink },
    });
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    if (!options.to || !options.subject) {
      throw new MailException('Missing required email fields (to, subject)');
    }
    return this.mailProvider.sendMail(options);
  }
}
