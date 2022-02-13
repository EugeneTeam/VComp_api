import { PrismaClient } from '@prisma/client';
import faker from 'faker';

export async function addPaymentTypes(prisma: PrismaClient, count: number = 1): Promise<any> {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        entry.push({
            name: faker.lorem.text()+Math.random(),
            isActive: Math.random() < 0.5,
            info: faker.lorem.text(),
        });
    }

    return prisma.paymentType.createMany({
        data: entry,
        skipDuplicates: true
    });
}
