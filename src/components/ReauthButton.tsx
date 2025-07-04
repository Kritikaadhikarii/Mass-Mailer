'use client';

import { signIn, signOut } from "next-auth/react";
import { useState } from "react";

interface ReauthButtonProps {
  className?: string;
  showHelp?: boolean;
}

export default function ReauthButton({ className = "", showHelp = false }: ReauthButtonProps) {
  const [isReauthing, setIsReauthing] = useState(false);
  const [showHelpText, setShowHelpText] = useState(showHelp);

  const handleReauth = async () => {
    try {
      setIsReauthing(true);
      await signOut({ redirect: false });
      await signIn("google", { callbackUrl: "/compose" });
    } catch (error) {
      console.error("Reauthentication error:", error);
      // Button state will reset when page reloads from signIn
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleReauth}
        disabled={isReauthing}
        className={`px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-blue-400 ${className}`}
      >
        {isReauthing ? "Authenticating..." : "Refresh Authentication"}
      </button>
      
      {showHelpText && (
        <div className="text-sm text-gray-600 mt-1">
          <p>Authentication issues? Try these steps:</p>
          <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
            <li>Click the button above to re-authenticate with Google</li>
            <li>Make sure you grant permission to send emails</li>
            <li>If using Gmail, check if your account has 2FA enabled, which may require an App Password</li>
          </ol>
        </div>
      )}
      
      {!showHelpText && (
        <button 
          onClick={() => setShowHelpText(true)}
          className="text-xs text-blue-600 hover:underline"
        >
          Need help?
        </button>
      )}
    </div>
  );
}
