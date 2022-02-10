import {PrismaClient} from '@prisma/client';
import faker from 'faker';
import { EDiscountType } from '../test/constants'

export async function addDiscounts(prisma: PrismaClient, count: number = 1): Promise<any> {
    const entry: any = [];
    let expiredAt: Date = new Date();
    expiredAt.setMonth(expiredAt.getMonth() + 1)
    for (let i = 0; i < count; i++) {
        const index: number = faker.datatype.number({ min: 0, max: 1 });
        const discount: string = [EDiscountType.PERCENT, EDiscountType.VALUE][index];
        entry.push({
            type: discount,
            value: faker.datatype.number({ min: 0, max: index === 0 ? 100 : 1000}),
            expiredAt: expiredAt
        });
    }

    return prisma.discount.createMany({
        data: entry,
        skipDuplicates: true
    });
}
