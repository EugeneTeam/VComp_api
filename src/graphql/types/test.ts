import {gql} from 'apollo-server-express';
import {PrismaClient} from '@prisma/client';

export default class Test {
    static resolver() {
        return {
            Query: {
                testQuery: async (obj: any, args: any, context: any) => {
                    const prisma = new PrismaClient()
                    console.log(await prisma.user.findMany())
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
