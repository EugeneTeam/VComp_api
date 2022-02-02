import { PrismaClient } from '@prisma/client';
import faker from 'faker';

export async function addCategory(prisma: PrismaClient, count: number = 1, parentIds: number[] = []): Promise<any> {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        entry.push({
            name: faker.lorem.word(),
            parentId: parentIds?.length ? parentIds[faker.datatype.number({
                min: 0,
                max: parentIds.length - 1
            })] : null,
        });
    }

    return prisma.article.createMany({
        data: entry,
        skipDuplicates: true
    });
}
