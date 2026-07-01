import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { SmtpProvider } from './providers/smtp.provider';

@Global()
@Module({
  providers: [
    {
      provide: 'MAIL_PROVIDER',
      useFactory: (configService: ConfigService) => {
        return new SmtpProvider(configService);
      },
      inject: [ConfigService],
    },
    MailService,
  ],
  exports: [MailService],
})
export class MailModule {}
