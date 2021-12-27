import {prisma} from '../config/prismaClient';

export const getRoleIdByName = async (name: string): Promise<number> => {
    const role = await prisma.role.findUnique({
        where: {
            name: name,
        },
    });
    if (!role) {
        throw new Error(`Role ${name} not found!`);
    }
    return role.id;
}
