'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { EmailRecipient, EmailData, EmailAttachment } from '@/types';

interface EmailComposerProps {
  onSendEmails: (emailData: EmailData) => Promise<void>;
  isLoading: boolean;
  preloadedRecipients?: { name: string; email: string }[];
}

export default function EmailComposer({
  onSendEmails,
  isLoading,
  preloadedRecipients = [],
}: EmailComposerProps) {
  const [subject, setSubject] = useState('');
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [attachments, setAttachments] = useState<EmailAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: '<p>Hello [Name], write your message here...</p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  useEffect(() => {
    if (preloadedRecipients.length > 0) {
      setRecipients(
        preloadedRecipients.map((r) => ({
          name: r.name,
          email: r.email,
          errors: {},
        }))
      );
    }
  }, [preloadedRecipients]);

  const addRecipient = () => {
    if (newRecipientName.trim() && newRecipientEmail.trim()) {
      const newRecipient: EmailRecipient = {
        name: newRecipientName.trim(),
        email: newRecipientEmail.trim(),
      };
      setRecipients([...recipients, newRecipient]);
      setNewRecipientName('');
      setNewRecipientEmail('');
    }
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const removeAllRecipients = () => {
    setRecipients([]);
  };

  const handleSend = async () => {
    const content = editor?.getHTML() || '';

    // Validate all required fields
    if (!subject.trim()) {
      alert('Please enter an email subject.');
      return;
    }

    if (!content.trim() || content === '<p>Hello [Name], write your message here...</p>') {
      alert('Please write your email content.');
      return;
    }

    if (recipients.length === 0) {
      alert('Please add at least one recipient.');
      return;
    }

    // Validate email format for all recipients
    const invalidEmails = recipients.filter((r) => !validateEmail(r.email));
    if (invalidEmails.length > 0) {
      alert(
        `The following email addresses appear to be invalid: ${invalidEmails
          .map((r) => r.email)
          .join(', ')}`
      );
      return;
    }

    const emailData: EmailData = {
      subject,
      content,
      recipients,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    await onSendEmails(emailData);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process each file
    const newAttachments: EmailAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check if it's a PDF
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are supported at this time.');
        continue;
      }

      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 10MB size limit.`);
        continue;
      }

      try {
        // Read the file as base64
        const base64Content = await readFileAsBase64(file);
        
        newAttachments.push({
          filename: file.name,
          content: base64Content,
          contentType: file.type
        });
      } catch (error) {
        console.error('Error reading file:', error);
        alert(`Failed to process file: ${file.name}`);
      }
    }

    if (newAttachments.length > 0) {
      setAttachments([...attachments, ...newAttachments]);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
          const base64Content = reader.result.split(',')[1];
          resolve(base64Content);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Simple email validation function
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Subject Field */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Subject
        </label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter email subject..."
        />
      </div>

      {/* Email Content Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Content
        </label>

        {/* Editor Toolbar */}
        <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor?.isActive('bold')
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor?.isActive('italic')
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor?.isActive('bulletList')
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor?.isActive('orderedList')
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            1. List
          </button>
        </div>

        {/* Editor Content */}
        <div className="border border-gray-300 border-t-0 rounded-b-md min-h-[200px]">
          <EditorContent editor={editor} />
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Tip: Use [Name] in your content to automatically replace it with each
          recipient's name.
        </p>
      </div>

      {/* File Attachment Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" 
              />
            </svg>
            Attach PDF Files
          </button>
          <span className="text-xs text-gray-500">
            Max 10MB per file, PDF only
          </span>
        </div>

        {/* Attached Files List */}
        {attachments.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Attached Files ({attachments.length})
            </h4>
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                >
                  <div className="flex items-center">
                    <svg 
                      className="w-5 h-5 text-red-600 mr-2" 
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span className="text-sm">{file.filename}</span>
                  </div>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recipients Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recipients</h3>
          {recipients.length > 0 && (
            <button
              onClick={removeAllRecipients}
              className="text-sm px-3 py-1 text-red-600 border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Remove All Recipients
            </button>
          )}
        </div>

        {/* Add New Recipient */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newRecipientName}
            onChange={(e) => setNewRecipientName(e.target.value)}
            placeholder="Recipient name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            value={newRecipientEmail}
            onChange={(e) => setNewRecipientEmail(e.target.value)}
            placeholder="recipient@example.com"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addRecipient}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>

        {/* Recipients List */}
        {recipients.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">
              Added Recipients ({recipients.length})
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {recipients.map((recipient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                >
                  <span className="text-sm">
                    <strong>{recipient.name}</strong> - {recipient.email}
                  </span>
                  <button
                    onClick={() => removeRecipient(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Send Button */}
      <div className="pt-4">
        <button
          onClick={handleSend}
          disabled={
            isLoading ||
            !subject.trim() ||
            !editor?.getHTML().trim() ||
            recipients.length === 0
          }
          className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? 'Sending Emails...'
            : `Send to ${recipients.length} Recipients${
                attachments.length > 0
                  ? ` with ${attachments.length} attachment${
                      attachments.length === 1 ? '' : 's'
                    }`
                  : ''
              }`}
        </button>
      </div>
    </div>
  );
}
