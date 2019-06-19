import { Injectable } from '@nestjs/common';
import mail from '@sendgrid/mail';
@Injectable()
export class NotificationService {
  public async verificationEmail(
    reciever: string,
    link: string,
    firstName: string,
  ): Promise<any> {
    const nodeEnv: string = process.env.SENDGRID_API_KEY as string;
    mail.setApiKey(nodeEnv);
    const emailBody = `
      <div>
        <h2 style="color: black">Hello ${firstName},
        Thanks for signing up with Paymaster </h2>
        Please click <a style="color: blue" href="${link}">here</a>
        To verify your email address,
        this link expires in two days.
        Alternatively you can copy out
        the link below and paste in your browser <a href="${link}">${link}</a>
      </div>
    `;
    const msg = {
      from: 'ottimothy@gmail.com',
      html: emailBody,
      subject: 'PayMaster Account Verification',
      text: 'Verify your account',
      to: reciever,
    };

    return mail
      .send(msg)
      .then(() => ({ success: true, message: 'email sent' }))
      .catch((err: any) => ({ success: false, message: err }));
  }
}
