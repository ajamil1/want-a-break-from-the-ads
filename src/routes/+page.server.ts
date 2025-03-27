import type { Load } from './$types';

export const load: Load = async ({ locals, url, cookies }) => {
    const test = process.env.TEST as string
    cookies.delete("userId", { path: "/" });
    return ({test})
}

