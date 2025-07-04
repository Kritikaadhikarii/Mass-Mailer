'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GoogleAvatarProps {
  user: {
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
  size?: number;
  className?: string;
}

export default function GoogleAvatar({ user, size = 40, className = '' }: GoogleAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.image || null);
  const [urlIndex, setUrlIndex] = useState(0);
  const [loadError, setLoadError] = useState(false);
  
  // List of possible Google avatar URLs to try in order
  const getGoogleAvatarUrls = (email: string) => {
    if (!email) return [];
    
    const googleId = email.split('@')[0];
    return [
      user.image, // First try the image from the session
      `/api/gmail-avatar`, // Our custom API route that uses OAuth to get Gmail profile picture
      `https://lh3.googleusercontent.com/a/${googleId}`, // Modern format
      `https://lh3.googleusercontent.com/a-/${googleId}`, // Alternative format
      `https://www.gravatar.com/avatar/${googleId}?d=https://ui-avatars.com/api/${encodeURIComponent(googleId)}/128/1E40AF/E0F2FE`,
      // Fallback to UI Avatars with initials as last resort
      `https://ui-avatars.com/api/?name=${encodeURIComponent(googleId)}&background=E0F2FE&color=1E40AF`
    ].filter(Boolean) as string[];
  };
  
  // Attempt to get Google profile picture
  useEffect(() => {
    // If the user has an email, generate the list of avatar URLs to try
    if (user.email && !loadError) {
      const avatarUrls = getGoogleAvatarUrls(user.email);
      
      // If we have URLs to try and we haven't gone through all of them yet
      if (avatarUrls.length > 0 && urlIndex < avatarUrls.length) {
        setAvatarUrl(avatarUrls[urlIndex]);
      } else {
        // We've tried all URLs, give up and use the fallback
        setLoadError(true);
      }
    }
  }, [user, urlIndex, loadError]);
  
  // Get initial letter for fallback
  const getInitial = () => {
    if (user.name) return user.name.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-full border-2 border-blue-200 shadow-md hover:border-blue-400 transition-all duration-200 hover:shadow-lg ${className}`}
      style={{ width: size, height: size }}
    >
      {avatarUrl && !loadError ? (
        <>
          {/* Gradient overlay for aesthetics */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 to-indigo-500/20 z-10 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
          <img
            src={avatarUrl}
            alt={user.name || "User Avatar"}
            className="h-full w-full object-cover"
            onError={() => {
              console.log(`Failed to load avatar image from URL: ${avatarUrl}`);
              
              // Try the next URL in our list
              const avatarUrls = user.email ? getGoogleAvatarUrls(user.email) : [];
              if (urlIndex < avatarUrls.length - 1) {
                setUrlIndex(urlIndex + 1);
              } else {
                // We've tried all URLs, give up and use the fallback
                console.log('Tried all avatar URLs, using fallback');
                setLoadError(true);
                setAvatarUrl(null);
              }
            }}
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-semibold">
          {getInitial()}
        </div>
      )}
    </div>
  );
}
