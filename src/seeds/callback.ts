import { PrismaClient } from '@prisma/client';
import faker from 'faker';

export async function addCallback(prisma: PrismaClient, count: number = 1): Promise<any> {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        let phoneNumber = faker.phone.phoneNumber();
        if (phoneNumber.length) {
            phoneNumber = phoneNumber.substring(0, 14);
        }
        entry.push({
            phone: phoneNumber,
            isProcessed: true,
        });
    }

    return prisma.callback.createMany({
        data: entry,
        skipDuplicates: true
    });
}
