import { gql } from 'apollo-server';
import {
    Callback as TCallback,
    MutationCloseCallbackArgs as TMutationCloseCallbackArgs,
    MutationRequestCallbackArgs as TMutationRequestCallbackArgs
} from '../../graphql';

export default class Callback {
    static resolver(): any {
        return {
            Mutation: {
                requestCallback: async (obj: any, args: TMutationRequestCallbackArgs, context: any): Promise<boolean> => {
                    if (args.phone.length > 15) {
                        throw new Error('Phone number is too long');
                    }

                    const checkCallback: TCallback = await context.prisma.callback.findFirst({
                        where: {
                            phone: args.phone,
                            isProcessed: true,
                        },
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
                closeCallback: async (obj: any, args: TMutationCloseCallbackArgs, context: any): Promise<boolean> => {
                    const callback: TCallback = await context.prisma.callback.findUnique({
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
                        },
                    });

                    return true;
                }
            }
        }
    }

    static typeDefs(): object {
        return gql`
            
            # TYPES
            
            type Callback {
                id: Int!
                phone: String!
                isProcessed: Boolean!
            }
        `;
    }
}
