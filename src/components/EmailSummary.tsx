import { EmailRecipient } from '@/types';

interface EmailSummaryProps {
  subject: string;
  recipients: EmailRecipient[];
  contentLength: number;
}

export default function EmailSummary({ subject, recipients, contentLength }: EmailSummaryProps) {
  if (!subject && recipients.length === 0 && contentLength === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium text-blue-900 mb-3">Email Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-blue-700">Subject:</span>
          <span className="text-blue-900 font-medium">
            {subject || 'Not set'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-blue-700">Recipients:</span>
          <span className="text-blue-900 font-medium">
            {recipients.length} {recipients.length === 1 ? 'person' : 'people'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-blue-700">Content length:</span>
          <span className="text-blue-900 font-medium">
            {contentLength} characters
          </span>
        </div>
      </div>
    </div>
  );
}
