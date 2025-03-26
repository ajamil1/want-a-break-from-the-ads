import type { Handle } from '@sveltejs/kit';
import { getTokenFromUser } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve, cookies }) => {
    const userId = event.cookies.get("userId");
    
    if (userId) {
        event.locals.user = await getTokenFromUser(userId);
    } else {
        event.locals.user = null;
    }

    return resolve(event);
};

export function getSession(event: { locals: { session: any } }) {

    return event.locals.session;
}



