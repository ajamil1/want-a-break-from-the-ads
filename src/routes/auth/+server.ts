// import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '$env/static/private';

export async function GET() {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/auth');
    authUrl.searchParams.set('client_id', process.env.YOUTUBE_CLIENT_ID as string);
    authUrl.searchParams.set('redirect_uri', process.env.YOUTUBE_REDIRECT_URI as string);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/youtube.readonly');
    authUrl.searchParams.set('access_type', 'offline');
    return new Response(null, { status: 302, headers: { Location: authUrl.toString() } });
}

