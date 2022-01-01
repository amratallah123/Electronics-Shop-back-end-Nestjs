import { ConfigService } from '@nestjs/config'
import { MailerOptions } from '@nestjs-modules/mailer'

export function mailerConfigFactory(
  config: ConfigService,
): MailerOptions | Promise<MailerOptions> {
  return {
    transport: {
      host: config.get('MAIL_HOST'),
      secure: false,
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASS'),
      },
    },
    defaults: {
      from: `"No Reply" <${config.get('MAIL_FROM')}>`,
    },
  }
}
