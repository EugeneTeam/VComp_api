import { PrismaClient } from '@prisma/client';
import faker from 'faker';

export async function addBannerImages(prisma: PrismaClient, count: number = 1, bannerIds: number[]): Promise<any> {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        entry.push({
            bannerId: bannerIds[faker.datatype.number({ min: 0, max: bannerIds.length - 1 })],
            imageUrl: faker.image.imageUrl(),
            title: faker.lorem.word(),
            productUrl: faker.internet.url(),
        });
    }

    return prisma.bannerImage.createMany({
        data: entry,
        skipDuplicates: true
    });
}
