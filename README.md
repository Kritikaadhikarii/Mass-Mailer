# Mass Mailer Application

A Next.js application for sending personalized mass emails using Gmail integration.

## Features

- 🔐 **Secure Gmail Authentication** - Login with your Google account
- ✍️ **Rich Text Editor** - Create beautiful emails with Quill.js editor
- 👥 **Multiple Recipients** - Add multiple recipients with names and emails
- 🎯 **Personalization** - Use `[Name]` placeholder to personalize emails
- 📧 **Bulk Email Sending** - Send emails to all recipients at once
- 🎨 **Modern UI** - Beautiful and responsive user interface

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - Your production domain callback URL (for production)

### 3. Environment Variables

Copy `.env.local` and fill in your credentials:

```env
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

To generate a NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Sign In** - Click "Sign in with Google" to authenticate with your Gmail account
2. **Compose Email** - Navigate to the compose page
3. **Add Recipients** - Add names and email addresses of recipients
4. **Write Content** - Use the rich text editor to create your email
5. **Personalize** - Use `[Name]` in your content to personalize with recipient names
6. **Send** - Click send to deliver emails to all recipients

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth API routes
│   │   └── send-email/route.ts          # Email sending API
│   ├── compose/page.tsx                 # Email composition page
│   ├── layout.tsx                       # Root layout with auth provider
│   └── page.tsx                         # Home page
├── components/
│   ├── AuthProvider.tsx                 # NextAuth session provider
│   ├── EmailComposer.tsx               # Email composition component
│   └── Navbar.tsx                      # Navigation component
├── lib/
│   └── auth.ts                         # NextAuth configuration
└── types/
    └── index.ts                        # TypeScript type definitions
```

## Technologies Used

- **Next.js 15** - React framework
- **NextAuth.js** - Authentication
- **Quill.js** - Rich text editor
- **Nodemailer** - Email sending
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## Security Notes

- Uses OAuth 2.0 for secure Gmail authentication
- Requires explicit user permission for sending emails
- All email sending happens server-side
- No email credentials are stored locally

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
