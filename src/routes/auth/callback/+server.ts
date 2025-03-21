// import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '$env/static/private';
import { json, redirect } from '@sveltejs/kit';

export async function GET({ url, cookies }) {
    const code = url.searchParams.get('code');
    if (!code) return json({ error: 'Missing code' }, { status: 400 });

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: "154213660126-gpm2mf8f8k3fibkp3jjfg1l92n4duge7.apps.googleusercontent.com",
            client_secret: "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",
            redirect_uri: "http://localhost:4000/auth/callback",
            grant_type: 'authorization_code',
            code
        })
    }).then(res => res.json());

    if (tokenResponse.error) return json(tokenResponse, { status: 400 });

    cookies.set('access_token', tokenResponse.access_token, {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: tokenResponse.expires_in
    });

    throw redirect(302, '/');
}
