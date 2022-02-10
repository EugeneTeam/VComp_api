import { PrismaClient } from '@prisma/client';
import faker from 'faker';
import {ECommentType} from "../test/constants";

export async function addComments(prisma: PrismaClient, count: number = 1, productIds: number[], parentIds: number[] | [], userIds: number[]): Promise<any> {
    const entry: any = [];
    for (let i = 0; i < count; i++) {
        entry.push({
            type: [ECommentType.COMMENT, ECommentType.QUESTION][faker.datatype.number({ min: 0, max: 1 })],
            rating: faker.datatype.number({ min: 1, max: 5 }),
            description: faker.lorem.text(),
            flaws: faker.lorem.text(),
            dignity: faker.lorem.text(),
            productId: productIds[faker.datatype.number({ min: 0, max: productIds.length - 1 })],
            userId: userIds[faker.datatype.number({ min: 0, max: userIds.length - 1 })],
            parentId: parentIds?.length ? parentIds[faker.datatype.number({ min: 0, max: parentIds.length - 1 })] : null
        });
    }


    return prisma.comment.createMany({
        data: entry,
        skipDuplicates: true
    });
}
