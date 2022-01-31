import faker from 'faker';
import { prisma } from '../../config/prismaClient';
import { getKeyValue } from "../../typescript/utils/helper";

export const compareObjects = (obj1: any, obj2: any) => {
    Object.keys(obj1).forEach((field: any) => {
        expect(getKeyValue<string, any>(field)(obj1))
            .toBe(getKeyValue<string, any>(field)(obj2));
    });
}

export const getRandomEntry = async (tableName: string, options: object | null = null) => {
    const table = getKeyValue<string, any>(tableName)(prisma);
    const list = await table.findMany(options);
    return list?.[faker.datatype.number({ min: 0, max: list.length - 1 })];
}
