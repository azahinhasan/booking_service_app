// email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT'),
      secure: false, // true for 465, false for 587
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendConfirmationEmail(
    toEmail: string,
    bookingId: number,
    name: string,
    price: number,
  ) {
    console.log(this.config.get<string>('SMTP_PASS'))
    const mailOptions = {
      from: `"Booking App" <${this.config.get<string>('SMTP_USER')}>`,
      to: toEmail,
      subject: 'Booking Confirmation',
      html: `
        <h3>Hello ${name},</h3>
        <p>Your booking has been <b>confirmed</b>.</p>
        <ul>
          <li>Booking ID: <b>${bookingId}</b></li>
          <li>Price: <b>$${price}</b></li>
        </ul>
        <p>Thank you for choosing our service.</p>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return info;
    } catch (err) {
      console.error('Error sending email:', err);
      return null;
    }
  }
}
