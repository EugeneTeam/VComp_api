import { PrismaClient } from '@prisma/client';
import faker from 'faker';

export async function addCharacteristic(prisma: PrismaClient, count: number = 1, categoryIds: number[]): Promise<any> {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        entry.push({
            name: faker.lorem.word(),
            value: faker.lorem.word(),
            url: faker.internet.url(),
            categoryId: categoryIds[faker.datatype.number({
                min: 0,
                max: categoryIds.length - 1,
            })],
        });
    }

    return prisma.characteristic.createMany({
        data: entry,
        skipDuplicates: true,
    });
}
