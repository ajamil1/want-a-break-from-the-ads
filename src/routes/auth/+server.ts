// import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '$env/static/private';

export async function GET({ url }) {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/auth');
    authUrl.searchParams.set('client_id', "154213660126-gpm2mf8f8k3fibkp3jjfg1l92n4duge7.apps.googleusercontent.com");
    authUrl.searchParams.set('redirect_uri', "music67e3b2d9645615827de4a79dhkxyjlcp.nubo.onl/auth/callback");
    //authUrl.searchParams.set('redirect_uri', "http://localhost:4000/auth/callback");
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/youtube.readonly');
    authUrl.searchParams.set('access_type', 'offline');

    return new Response(null, { status: 302, headers: { Location: authUrl.toString() } });
}

