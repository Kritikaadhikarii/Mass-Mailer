import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import nodemailer from "nodemailer";
import { EmailData, EmailAttachment } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !(session as any).accessToken) {
      console.error("Authentication error: Missing session or access token");
      return NextResponse.json({ 
        error: "Not authenticated or missing access token. Please sign in again." 
      }, { status: 401 });
    }

    const emailData: EmailData = await request.json();
    const { subject, content, recipients } = emailData;

    // Get and validate user email
    const userEmail = session.user?.email || '';
    if (!userEmail) {
      return NextResponse.json({ 
        error: "User email not available in session" 
      }, { status: 400 });
    }

    // Log important info for debugging (remove sensitive data in production)
    console.log("Email sending attempt:", {
      userEmail: userEmail,
      recipientCount: recipients.length,
      hasAccessToken: Boolean((session as any).accessToken),
      hasAttachments: Boolean(emailData.attachments?.length),
      attachmentCount: emailData.attachments?.length || 0,
    });

    // Create transporter with direct pass
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: userEmail,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        accessToken: (session as any).accessToken,
      },
    } as any);

    // Check if token looks valid
    if (!session.user?.email || !(session as any).accessToken) {
      console.error("Missing user email or access token");
      return NextResponse.json({ 
        error: "Your Gmail access token is missing or invalid. Please sign in again.",
        detail: "Missing authentication details",
        code: "TOKEN_MISSING"
      }, { status: 401 });
    }
    
    // Skip SMTP verification as it's causing issues with OAuth2
    console.log("Skipping SMTP verification, will attempt direct send");

    // Log that we're going to attempt sending emails directly
    console.log("Proceeding to send emails directly");
    
    // Send emails to all recipients
    const results = await Promise.allSettled(
      recipients.map(async (recipient) => {
        try {
          const personalizedContent = content.replace(/\[Name\]/g, recipient.name);
          
          // Process attachments if any
          let attachmentsForEmail = undefined;
          
          if (emailData.attachments && emailData.attachments.length > 0) {
            attachmentsForEmail = emailData.attachments.map((attachment: EmailAttachment) => {
              return {
                filename: attachment.filename,
                content: attachment.content,
                encoding: 'base64',
                contentType: attachment.contentType
              };
            });
          }
          
          // Try direct send without verify first
          const result = await new Promise((resolve, reject) => {
            const mailOptions = {
              from: userEmail,
              to: recipient.email,
              subject: subject,
              html: personalizedContent,
              attachments: attachmentsForEmail
            };
            
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.error(`Send error to ${recipient.email}:`, err);
                reject(err);
              } else {
                resolve(info);
              }
            });
          });
          
          console.log(`Email sent successfully to ${recipient.email}`);
          return { recipient, status: 'sent' };
        } catch (emailError: any) {
          console.error(`Failed to send email to ${recipient.email}:`, emailError);
          throw { 
            recipient: recipient.email,
            error: emailError?.message || "Unknown error",
            code: emailError?.code
          };
        }
      })
    );

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    // Log failed results for debugging
    const failedResults = results.filter(result => result.status === 'rejected');
    if (failedResults.length > 0) {
      console.error('Failed email attempts:', 
        failedResults.map(r => ({ 
          recipient: (r as any).reason?.recipient,
          error: (r as any).reason?.error, 
          code: (r as any).reason?.code 
        }))
      );
    }

    return NextResponse.json({
      message: `Emails sent: ${successful} successful, ${failed} failed`,
      successful,
      failed,
      errors: failedResults.map(r => ({
        recipient: (r as any).reason?.recipient || 'Unknown recipient',
        error: (r as any).reason?.error || 'Unknown error',
        code: (r as any).reason?.code
      })),
    });

  } catch (error: any) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: error.message || "Failed to send emails" },
      { status: 500 }
    );
  }
}
