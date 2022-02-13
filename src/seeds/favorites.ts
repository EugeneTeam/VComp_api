import { PrismaClient } from '@prisma/client';
import faker from 'faker';

export async function addFavorites(prisma: PrismaClient, count: number = 1, userIds: number[], productIds: number[]): Promise<any> {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        entry.push({
            userId: userIds[faker.datatype.number({ min: 0, max: userIds.length - 1 })],
            productId: productIds[faker.datatype.number({ min: 0, max: productIds.length - 1 })]
        });
    }

    return prisma.favorite.createMany({
        data: entry,
        skipDuplicates: true
    });
}
