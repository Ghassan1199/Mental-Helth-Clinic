import nodemailer from 'nodemailer';
import { injectable } from 'tsyringe';
@injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        text,
      });
    } catch (error) {
      console.error("Failed to send email");
    }
  }
}
