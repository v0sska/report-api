import { EmailTemplateUtil } from '@/common/utils/email-temlates.util';
import { SmtpUtil } from './smtp.util';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService extends SmtpUtil {
  public constructor() {
    super();
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
