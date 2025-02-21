import { generate } from "generate-password";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  },
});

export const generateTempPassword = () => generate({
  length: 12,
  numbers: true,
  symbols: true,
  uppercase: true,
  excludeSimilarCharacters: true,
});

export const sendWelcomeEmail = async (email: string, tempPassword: string) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Notate: Register credentials",
    html: `
      <h1>Welcome to Notate!</h1>
      <p>Your account has been successfully created.</p>
      <p>Here are your temporary credentials:</p>
      <ul>
        <li>Email: ${email}</li>
        <li>Temporary Password: ${tempPassword}</li>
      </ul>
      <p>Please change your password after first login.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);

    throw new Error("Failed to send welcome email");
  }
};
