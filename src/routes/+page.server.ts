import type { Load } from './$types';
import { prisma } from '$lib/server/database';
import dotenv from 'dotenv';

dotenv.config();

export const actions = {
    deleteItem: async ({ request }) => {
        try {
            const formData = await request.formData();
            const item = formData.get('name');
            await prisma.item.delete({
                where: { name: item },  // Check if a item with this name exists
            });
        } catch (e) {
            console.log(e)
        }

        const groceries = await prisma.item.findMany()
        return { groceries };
    },
    addItem: async ({ request }) => {
        console.log("Enter")
        try {
            const formData = await request.formData();
            const item = formData.get('name');
            await prisma.item.create({
                data: { name: item },  // Check if a item with this name exists
            });
        } catch (e) {
            console.log(e)
        }
        const groceries = await prisma.item.findMany()
        return { groceries };
    },


};

export const load: Load = async ({ locals, url, cookies }) => {
    const groceries = await prisma.item.findMany()
    return { groceries };
}

