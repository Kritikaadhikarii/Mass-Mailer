import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import { refreshAccessToken } from "./token";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request all the necessary Gmail scopes for SMTP access
          scope: [
            "openid",
            "email", 
            "profile", 
            "https://www.googleapis.com/auth/gmail.send",
            "https://mail.google.com/",
            "https://www.googleapis.com/auth/gmail.compose",
            "https://www.googleapis.com/auth/gmail.modify"
          ].join(" "),
          access_type: "offline", 
          prompt: "consent", 
          include_granted_scopes: true
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
          refreshToken: account.refresh_token,
          user
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      console.log("Access token has expired, attempting to refresh");
      
      try {
        // Attempt to refresh the token if we have a refresh token
        if (token.refreshToken) {
          const refreshedTokens = await refreshAccessToken(token.refreshToken as string);
          
          console.log("Token refreshed successfully");
          
          return {
            ...token,
            accessToken: refreshedTokens.accessToken,
            accessTokenExpires: refreshedTokens.accessTokenExpires,
            refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
          };
        } else {
          console.error("No refresh token available");
          return {
            ...token,
            error: "NoRefreshTokenError"
          };
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
        return {
          ...token,
          error: "RefreshAccessTokenError"
        };
      }
    },
    async session({ session, token }) {
      if (token.error) {
        (session as any).error = token.error;
      }
      (session as any).accessToken = token.accessToken;
      (session as any).user = token.user;
      return session;
    }
  },
  pages: {
    signIn: '/',
    error: '/' // Custom error page
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);