export interface EmailRecipient {
  name: string;
  email: string;
}

export interface EmailAttachment {
  filename: string;
  content: string; // base64 encoded file content
  contentType: string;
}

export interface EmailData {
  subject: string;
  content: string;
  recipients: EmailRecipient[];
  attachments?: EmailAttachment[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  accessToken: string;
}