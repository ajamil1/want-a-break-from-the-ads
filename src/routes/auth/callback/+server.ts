// import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '$env/static/private';
import { prisma } from '$lib/server/database';
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
            redirect_uri: "http://music67e3b2d9645615827de4a79dhkxyjlcp.nubo.onl/auth/callback",
            //redirect_uri: "http://localhost:4000/auth/callback",
            grant_type: 'authorization_code',
            code
        })
    }).then(res => res.json());

    if (tokenResponse.error) return json(tokenResponse, { status: 400 });

    
    

    const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true', {
        headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
        },
        });
      
        const userInfo = await response.json();
        //console.log(userInfo.items[0]);
        //await prisma.user.deleteMany({});

        try {
            const existingUser = await prisma.user.findUnique({
                where: { id: userInfo.items[0].id },  // Check if a user with this id exists
            });

            if (!existingUser) {
                console.log(`%c New User: ` + userInfo.items[0].id, `color: green`)
                // Store user info in the database (You can store the access token here)
                await prisma.user.create({
                    data: {
                        id: userInfo.items[0].id,
                        accessToken: tokenResponse.access_token,
                        maxAge: tokenResponse.expires_in
                    }
                });      
            }
            else 
            {
                console.log(`%c Existing User: ` + userInfo.items[0].id, `color: green`)
                await prisma.user.upsert({
                    where: { id: userInfo.items[0].id  },
                    update: { accessToken: tokenResponse.access_token },
                    create: {
                        id: userInfo.items[0].id,
                        accessToken: tokenResponse.access_token,
                        maxAge: tokenResponse.expires_in
                    }
                });
            }

            
            const users = await prisma.user.findMany();
            console.log(users);

            cookies.set('userId', userInfo.items[0].id, {
                httpOnly: true,
                secure: true,
                path: '/',
                maxAge: tokenResponse.expires_in
            });

            

        } catch(e) { 
            console.error('Error handling user:', e);
        }
   
        

        throw redirect(302, '/');
}
