import { PrismaClient } from '@prisma/client';
import faker from 'faker';

export async function addImages(prisma: PrismaClient, count: number = 1): Promise<any> {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        entry.push({
            name: faker.lorem.word() + Math.random(),
            url: faker.internet.url(),
            order: faker.datatype.number({ min: 1, max: 1000 }),
        });
    }

    return prisma.image.createMany({
        data: entry,
        skipDuplicates: true
    });
}

export async function addImagesToGallery(prisma: PrismaClient, count: number = 1, galleryIds: number[], imageIds: number[]) {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        entry.push({
            galleryId: galleryIds[faker.datatype.number({ min: 0, max: galleryIds.length - 1 })],
            imageId: imageIds[faker.datatype.number({ min: 0, max: imageIds.length - 1 })]
        });
    }

    return prisma.lImageGallery.createMany({
        data: entry,
        skipDuplicates: true
    });
}
