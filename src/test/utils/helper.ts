import faker from 'faker';
import { prisma } from '../../config/prismaClient';
import { getKeyValue } from "../../typescript/utils/helper";

export const compareObjects = (obj1: any, obj2: any, dateFieldName: null | string = null) => {
    Object.keys(obj1).forEach((field: any) => {
        let arg1 = getKeyValue<string, any>(field)(obj1);
        let arg2 = getKeyValue<string, any>(field)(obj2);
        if (dateFieldName === field) {
            arg1 = new Date(createDate(arg1.toString())).toUTCString();
            arg2 = new Date(createDate(arg2.toString())).toUTCString();
        }
        expect(arg1).toBe(arg2);
    });
}

export const createDate = (date: string): number | string => {
    if (/^[0-9]+$/.test(date)) {
        return Number(date)
    }
    return date;
}

export const getRandomEntry = async (tableName: string, options: object | null = null) => {
    const table = getKeyValue<string, any>(tableName)(prisma);
    const list = await table.findMany(options);
    return list?.[faker.datatype.number({ min: 0, max: list.length - 1 })];
}
