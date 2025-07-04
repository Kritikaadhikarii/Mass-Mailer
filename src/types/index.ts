export interface EmailRecipient {
  name: string;
  email: string;
}

export interface EmailData {
  subject: string;
  content: string;
  recipients: EmailRecipient[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  accessToken: string;
}