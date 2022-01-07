import {prisma} from '../config/prismaClient';
import {findEntryById} from './utils/helper';

interface IPaymentType {
    id: number
    name: string
    isActive: boolean
    info: string
}

export const checkPaymentTypeName = async (name: string): Promise<void> => {
    const checkPaymentType = await prisma.paymentType.findMany({
        where: {name},
    });

    if (checkPaymentType.length) {
        throw new Error('Name is used');
    }
}

export const getPaymentTypeById = async (id: number): Promise<IPaymentType> => {
    return findEntryById(id, 'paymentType');
}
