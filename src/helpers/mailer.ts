import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

import User from '@/models/user';

export async function sendEmail(
  email: string,
  emailType: 'verify' | 'reset',
  userId: string,
) {
  try {
    // hash id to create a token (for email verification or password reset)
    const hashedToken = await bcrypt.hash(userId.toString(), 12);
    if (emailType === 'verify') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 86400000, // 24 hours
      });
    } else if (emailType === 'reset') {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 14400000, // 4 hours
      });
    }
    // nodemailer transporter with options
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const mailOptions = {
      from: 'x',
      to: email,
      subject:
        emailType === 'verify' ? 'Verify your email' : 'Reset your password',
      html: `<p>Click <a href="${process.env.DOMAIN}/verify-email?token=${hashedToken}">here</a> to ${emailType === 'verify' ? 'verify your email' : 'reset your password'}.</p>`,
    };
    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}
