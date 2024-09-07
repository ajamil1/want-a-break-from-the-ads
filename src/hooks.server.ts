import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.session = event.locals.session || {};
    return resolve(event);
};

export function getSession(event: { locals: { session: any } }) {
    return event.locals.session;
}
