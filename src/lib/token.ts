import axios from 'axios';

/**
 * Helper function to refresh OAuth2 token
 */
export async function refreshAccessToken(refreshToken: string) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

    // Make a POST request to Google's token endpoint
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return {
      accessToken: tokenResponse.data.access_token,
      accessTokenExpires: Date.now() + tokenResponse.data.expires_in * 1000,
      refreshToken: tokenResponse.data.refresh_token ?? refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}
