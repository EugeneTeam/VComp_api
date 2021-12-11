import {gql} from 'apollo-server-express';
import {PrismaClient} from '@prisma/client';

import {IDeliveryServices, IPaymentType} from '../typescript/interfaces'

export default class Test {
    static resolver() {
        return {
            Query: {
                testQuery: async (obj: any, args: any, context: any) => {
                    const prisma: PrismaClient = new PrismaClient()
                    const temp: Array<IPaymentType> = await prisma.deliveryService.findMany()
                    console.log(temp)
                    return {
                        status: 'SUCCESS',
                        message: 'TEST ROUTE!'
                    }
                }
            }
        }
    }

    static typeDefs() {
        return gql`
            type TestRoute {
                status: String
				message: String
            }
        `
    }
}
