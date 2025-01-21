import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import config from '../../common/configs';

export class SmtpUtil {
  private transporter: Transporter;

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
      console.log('Error sending email', error);
    }
  }
}
