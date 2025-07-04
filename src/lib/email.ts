import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from: string;
  accessToken: string;
}

export async function sendEmail(options: EmailOptions) {
  // Create transporter with OAuth2 auth
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      type: 'OAuth2',
      user: options.from,
      accessToken: options.accessToken,
    },
    // Adding debug option to help with troubleshooting
    logger: process.env.NODE_ENV !== 'production',
    debug: process.env.NODE_ENV !== 'production',
  });

  try {
    // Verify the connection before attempting to send
    await transporter.verify();
    
    // Send email with detailed options
    const info = await transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      // Additional options that can improve delivery
      priority: 'normal',
      headers: {
        'X-Priority': '3', // Normal priority
      }
    });
    
    return info;
  } catch (error) {
    console.error('Email sending error in library:', error);
    throw error;
  }
}

export function personalizeContent(content: string, recipientName: string): string {
  return content.replace(/\[Name\]/g, recipientName);
}
