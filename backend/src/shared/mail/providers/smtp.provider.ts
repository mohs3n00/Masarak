import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { MailProvider, SendMailOptions } from '../mail.interface';
import { MailException } from '../exceptions/mail.exception';

@Injectable()
export class SmtpProvider implements MailProvider {
  private readonly logger = new Logger(SmtpProvider.name);
  private transporter: nodemailer.Transporter;
  private readonly defaultFrom: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('mail.host');
    const port = this.configService.get<number>('mail.port');
    const user = this.configService.get<string>('mail.user');
    const pass = this.configService.get<string>('mail.pass');
    this.defaultFrom =
      this.configService.get<string>('mail.from') ||
      '"Masarak" <noreply@masarak.com>';

    if (!host || !user || !pass) {
      this.logger.warn(
        'SMTP configuration is missing. Emails will fail if SmtpProvider is used.',
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    try {
      let html = options.html;

      if (options.templateName) {
        html = this.compileTemplate(
          options.templateName,
          options.context || {},
        );
      }

      await this.transporter.sendMail({
        from: this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html,
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to send email to ${options.to}: ${error.message}`,
      );
      throw new MailException('Failed to send email', error);
    }
  }

  private compileTemplate(
    templateName: string,
    context: Record<string, any>,
  ): string {
    try {
      const templatePath = path.join(
        __dirname,
        '../../templates',
        `${templateName}.hbs`,
      );
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);
      return compiledTemplate(context);
    } catch (error: any) {
      this.logger.error(
        `Failed to compile template ${templateName}: ${error.message}`,
      );
      throw new MailException(
        `Failed to compile template ${templateName}`,
        error,
      );
    }
  }
}
