import {prisma} from "../../config/prismaClient";

export const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) => obj[key];

export const findEntry = async (id: number, name: string) => {
    const item: any = await getKeyValue<any, any>(name)(prisma).findUnique({where: {id}});

    if (!item) {
        throw new Error(`${name} not found`)
    }

    return item;
}
