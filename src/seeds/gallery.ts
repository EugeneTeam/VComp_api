import { PrismaClient } from '@prisma/client';
import faker from 'faker';

export async function addGalleries(prisma: PrismaClient, count: number = 1): Promise<any> {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        entry.push({
            name: faker.lorem.word() + Math.random(),
        });
    }

    return prisma.gallery.createMany({
        data: entry,
        skipDuplicates: true
    });
}
