import { PrismaClient } from '@prisma/client';
import faker from 'faker';

export async function addArticles(prisma: PrismaClient, count: number = 1, articleCategoriesIds: [number]): Promise<any> {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        entry.push({
            articleCategoryId: articleCategoriesIds[faker.datatype.number({
                min: 0,
                max: articleCategoriesIds.length - 1
            })],
            title: faker.lorem.text(),
            text: faker.lorem.text(),
            image: faker.image.imageUrl(),
            status: Math.random() < 0.5 ? 'HIDDEN' : 'VISIBLE',
            source: faker.internet.url(),
        });
    }

    return prisma.article.createMany({
        data: entry,
        skipDuplicates: true
    });
}
