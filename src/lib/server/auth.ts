import { prisma } from "$lib/server/database"; // Your database connection

export async function getTokenFromUser(userId: string) {
    if (!userId) return null;

    // Query the database for the user associated with this session token
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    return {
        accessToken: user.accessToken, 
        maxAge: user.maxAge
    };
}