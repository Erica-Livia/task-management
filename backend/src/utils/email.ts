import { createTransporter } from "../config/mail-transport";

export async function sendVerificationEmail(email: string, verifyToken: string) {
  // @ts-ignore
  const link = `${process.env.FRONTEND_URL.replace(/\/$/, "")}/verify-email?token=${verifyToken}`;
  const transporter = await createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #F4F7FD; padding: 2rem; color: #2B2C37;">
        <h2 style="color: #635FC7;">Welcome to Kanban!</h2>
        <p style="margin-bottom: 1rem;">Click the button below to verify your email address.</p>
        <a href="${link}" style="display: inline-block; background-color: #635FC7; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Verify My Email
        </a>
        <p style="margin-top: 1rem; font-size: 0.875rem;">This link will expire in 24 hours.</p>
      </div>
    `,
  });
}

export const sendResetPasswordEmail = async (email: string, resetToken: string) => {
  // @ts-ignore
  const link = `${process.env.FRONTEND_URL.replace(/\/$/, "")}/reset-password?token=${resetToken}`;
  const transporter = await createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #F4F7FD; padding: 2rem; color: #2B2C37;">
        <h2 style="color: #EA5555;">Password Reset Request</h2>
        <p style="margin-bottom: 1rem;">Click the button below to reset your password:</p>
        <a href="${link}" style="display: inline-block; background-color: #EA5555; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Reset Password
        </a>
        <p style="margin-top: 1rem; font-size: 0.875rem;">If you didn’t request this, you can ignore this email.</p>
        <p style="font-size: 0.875rem;">This link expires in 15 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send reset password email. Please try again later.');
  }
};
