import { PrismaClient } from '@prisma/client';
import faker from 'faker';

export async function addProducts(
    prisma: PrismaClient,
    count: number = 1,
    discountIds: number[],
    categoryIds: number[],
    galleryIds: (number | null | undefined)[]
): Promise<any> {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        entry.push({
            description: faker.lorem.text(),
            name: faker.lorem.word() + Math.random(),
            price: faker.datatype.number({ min: 0, max: 100000 }),
            discountId: discountIds?.[faker.datatype.number({ min: 0, max: discountIds.length + discountIds.length })] || null,
            categoryId: categoryIds[faker.datatype.number({ min: 0, max: categoryIds.length - 1 })],
            galleryId: galleryIds[faker.datatype.number({ min: 0, max: galleryIds.length - 1 })],
        });
    }

    return prisma.product.createMany({
        data: entry,
        skipDuplicates: true
    });
}
