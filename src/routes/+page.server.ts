import type { Load } from './$types';
import { prisma } from '$lib/server/database';
import dotenv from 'dotenv';

dotenv.config();

export const actions = {
    deleteItem: async ({ request }) => {
        const formData = await request.formData();
        const item = formData.get('name');
        try {
            await prisma.item.delete({
                where: { name: item },  // Check if a item with this name exists
            });
        } catch (e) {
            console.log(e)
        }
        console.log("Deleted Item: " + item)

        const groceries = await prisma.item.findMany()
        return { groceries, item: item };
    },
    addItem: async ({ request }) => {
        const formData = await request.formData();
        const item = formData.get('name');
        try {
            await prisma.item.create({
                data: { name: item },  // Check if a item with this name exists
            });
        } catch (e) {
            console.log(e)
        }
        console.log("Added Item: " + item)
        const groceries = await prisma.item.findMany()
        return { groceries };
    },


};

export const load: Load = async ({ locals, url, cookies }) => {
    const groceries = await prisma.item.findMany()
    return { groceries };
}

