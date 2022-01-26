import { PrismaClient } from '@prisma/client';
import faker from 'faker';

export async function addArticleCategory(prisma: PrismaClient, count: number = 1): Promise<any> {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        entry.push({
            name: faker.lorem.word(),
            parentId: null,
        });
    }

    return prisma.articleCategory.createMany({
        data: [{
            name: faker.lorem.word(),
            parentId: null
        }, {
            name: faker.lorem.word(),
            parentId: null
        }, {
            name: faker.lorem.word(),
            parentId: 1
        }].concat(entry),
        skipDuplicates: true
    });
}
