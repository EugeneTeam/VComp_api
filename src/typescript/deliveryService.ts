import { prisma } from "../config/prismaClient";
import {findEntryById} from "./utils/helper";

export const checkDeliveryServiceName = async (name: string) => {
    const deliveryServices = await prisma.deliveryService.findMany({
        where: { name },
    });

    if (deliveryServices.length) {
        throw new Error('Name is used');
    }
}

export const getDeliveryServiceById = async (serviceId: number): Promise<any | null>  => {
    return findEntryById(serviceId, 'deliveryService')
}
