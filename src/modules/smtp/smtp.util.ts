import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

import config from '../../common/configs';

import { ClassLoggerService } from '@/common/utils/loger.util';

export class SmtpUtil {
  private transporter: Transporter;
  private logger: ClassLoggerService;
  protected constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: Number(config.smtp.port),
      secure: true,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
    this.logger = new ClassLoggerService(SmtpUtil.name);
  }

  protected async sendMail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.smtp.user,
        to,
        subject,
        html,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
