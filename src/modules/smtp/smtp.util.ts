import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import config from '../../common/configs';
import { EmailTemplateUtil } from '@/common/utils/email-temlates.util';

@Injectable()
export class SmtpUtil {
  private transporter: Transporter;

  public constructor() {
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

  private async sendMail(
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

  public async sendInviteEmail(
    to: string,
    subject: string,
    role: string,
    inviteLink: string,
  ) {
    const htmlTemplate = EmailTemplateUtil.inviteTemplate(
      role,
      inviteLink,
      subject,
    );
    await this.sendMail(to, subject, htmlTemplate);
  }
}
