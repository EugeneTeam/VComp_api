import { PrismaClient } from '@prisma/client';
import faker from 'faker';
import {
    EBannerPositionX,
    EBannerPositionY
} from "../test/constants";

export async function addBanner(prisma: PrismaClient, count: number = 1): Promise<any> {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        entry.push({
            page: faker.lorem.word(),
            title: faker.lorem.word(),
            positionX: [
                EBannerPositionX.LEFT,
                EBannerPositionX.RIGHT,
                EBannerPositionX.MIDDLE
            ]
                [faker.datatype.number({ min: 0, max: 2 })],
            positionY: [
                EBannerPositionY.BOTTOM,
                EBannerPositionY.TOP,
                EBannerPositionY.MIDDLE
            ]
                [faker.datatype.number({ min: 0, max: 2 })],
            html: faker.lorem.word(),
        });
    }

    return prisma.banner.createMany({
        data: entry,
        skipDuplicates: true
    });
}
