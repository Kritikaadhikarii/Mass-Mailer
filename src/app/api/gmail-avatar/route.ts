// This API route proxies a request to get the user's Gmail avatar
// using the access token we already have

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !(session as any).accessToken || !session.user?.email) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const userEmail = session.user.email;
    const accessToken = (session as any).accessToken;
    
    // Fetch the profile picture from Gmail API
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${userEmail}/profile`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      console.error('Failed to fetch Gmail profile:', await response.text());
      return new Response('Failed to fetch profile', { status: response.status });
    }
    
    const data = await response.json();
    
    // If there's a profile picture, return it
    if (data.historyId) {
      // For Gmail profiles, we need to get the user's profile picture
      // This redirects to the Google profile picture
      const pictureUrl = `https://lh3.googleusercontent.com/a/${data.historyId}`;
      return NextResponse.redirect(pictureUrl);
    }
    
    // If there's no profile picture, return a 404
    return new Response('No profile picture found', { status: 404 });
  } catch (error) {
    console.error('Error fetching Gmail avatar:', error);
    return new Response('Error fetching avatar', { status: 500 });
  }
}
