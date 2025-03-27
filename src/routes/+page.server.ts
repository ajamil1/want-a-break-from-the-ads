import type { Load } from './$types';

export const load: Load = async ({ locals, url, cookies }) => {
    console.log(process.env.TEST as string)
    cookies.delete("userId", { path: "/" });
}

