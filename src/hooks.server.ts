import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve, cookies }) => {
   

    return resolve(event);
};

export function getSession(event: { locals: { session: any } }) {

    
    return event.locals.session;
}



