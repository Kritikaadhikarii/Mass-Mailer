'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { EmailRecipient, EmailData } from '@/types';

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
    };

    await onSendEmails(emailData);
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

      {/* Recipients Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recipients</h3>

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
            : `Send to ${recipients.length} Recipients`}
        </button>
      </div>
    </div>
  );
}
