import {PrismaClient} from '@prisma/client';

export async function addRoles(prisma: PrismaClient): Promise<any> {
    return prisma.role.createMany({
        data: [
            { name: 'ADMIN' },
            { name: 'MANAGER' },
            { name: 'CUSTOMER' },
            { name: 'GOVERNING_ARTICLES' },
            { name: 'BANNER_MANAGER' },
        ],
        skipDuplicates: true
    });
}
