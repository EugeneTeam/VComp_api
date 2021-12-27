import {gql} from 'apollo-server';

export default class Callback {
    static resolver() {
        return {
            Mutation: {
                requestCallback: async (obj: any, args: {phone: string}, context: any) => {
                    const checkCallback = await context.prisma.callback.findFirst({
                        where: {
                            phone: args.phone,
                            isProcessed: true,
                        }
                    });

                    if (checkCallback) {
                        throw new Error('You have already requested a call back. Please wait response');
                    }

                    await context.prisma.callback.create({
                        data: {
                            phone: args.phone,
                            isProcessed: true,
                        },
                    });

                    return true;
                },
                closeCallback: async (obj: any, args: {id: number}, context: any) => {
                    const callback = await context.prisma.callback.findUnique({
                        where: {
                            id: args.id,
                        },
                    });

                    if (!callback) {
                        throw new Error('Callback not found');
                    }

                    if (!callback.isProcessed) {
                        throw new Error('Callback is closed');
                    }

                    await context.prisma.callback.update({
                        where: {
                            id: args.id,
                        },
                        data: {
                            isProcessed: false,
                        }
                    })

                    return true;
                }
            }
        }
    }

    static typeDefs() {
        return gql`
            type Callback {
                id: Int!
                phone: String!
                isProcessed: Boolean!
            }
        `;
    }
}
