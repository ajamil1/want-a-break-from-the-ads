import { prisma } from '$lib/server/database';
import { json, redirect } from '@sveltejs/kit';

export async function GET({ url, cookies }) {
    const code = url.searchParams.get('code');
    if (!code) {
        throw redirect(302, '/codeerror');
        //return json({ error: 'Missing code' }, { status: 400 });
    } 

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.YOUTUBE_CLIENT_ID as string,
            client_secret: process.env.YOUTUBE_CLIENT_SECRET as string,
            redirect_uri: process.env.YOUTUBE_REDIRECT_URI as string,
            grant_type: 'authorization_code',
            code
        })
    }).then(res => res.json());

    if (tokenResponse.error) {
        console.log(tokenResponse.error);
        //return json(tokenResponse, { status: 400 })
        throw redirect(302, '/tokenerror');
    }
        

    const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true', {
        headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
        },
        });
      
        const userInfo = await response.json();

        try {
            const existingUser = await prisma.user.findUnique({
                where: { id: userInfo.items[0].id },  // Check if a user with this id exists
            });

            if (!existingUser) {
                console.log(`New User: ` + userInfo.items[0].id)
                // Store user info in the database (You can store the access token here)
                await prisma.user.create({
                    data: {
                        name: userInfo.items[0].snippet.title,
                        id: userInfo.items[0].id,
                        accessToken: tokenResponse.access_token,
                        maxAge: tokenResponse.expires_in
                    }
                });      
            }
            else 
            {
                console.log(`Existing User: ` + userInfo.items[0].id)
                await prisma.user.upsert({
                    where: { id: userInfo.items[0].id  },
                    update: { accessToken: tokenResponse.access_token },
                    create: {
                        name: userInfo.items[0].snippet.title,
                        id: userInfo.items[0].id,
                        accessToken: tokenResponse.access_token,
                        maxAge: tokenResponse.expires_in
                    }
                });
            }

            cookies.set('userId', userInfo.items[0].id, {
                httpOnly: true,
                secure: true,
                path: '/',
                maxAge: tokenResponse.expires_in
            });

        } catch(e) { 
            console.error('Error handling user:', e);
        }

        throw redirect(302, '/' + userInfo.items[0].id);
}
