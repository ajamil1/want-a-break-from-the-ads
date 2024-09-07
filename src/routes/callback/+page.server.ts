import { redirect } from '@sveltejs/kit';
import type { Load } from './$types';
import goto from 'svelte'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Function to create and set a JWT as a cookie
function setJwtCookie(cookies: any, token: string) {
  cookies.set('auth_token', token, {
    path: '/',
    httpOnly: true, // Prevent access via JavaScript
    secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export const load: Load = async ({ url, locals, cookies }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    return new Response('Authorization failed', { status: 400 });
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI as string,
        client_id: process.env.SPOTIFY_CLIENT_ID as string,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET as string,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tokens');
    }

    const data = await response.json();
    const { access_token, refresh_token, expires_in } = data;

    // Create a JWT with the Spotify data
    const jwtToken = jwt.sign(
      { access_token, refresh_token, expires_in },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' } // JWT expiration time
    );

    // Set the JWT as a cookie
    setJwtCookie(cookies, jwtToken);

    // Redirect to home or another page
    return goto('/');
  } catch (error) {
    console.error('Failed to fetch tokens:', error);
    return { status: 500 };
  }
};
