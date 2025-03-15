import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config';

// Isolates email sending logic.
const transporter: Transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: config.emailPort === 465,
  auth: { user: config.emailUser, pass: config.emailPass },
});

export async function sendEmail(subject: string, text: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: config.emailFrom,
      to: config.emailTo,
      subject,
      text,
    });
    console.log(`Email sent to ${config.emailTo} with subject: ${subject}`);
  } catch (error) {
    console.error('Failed to send email:', (error as Error).message);
  }
}