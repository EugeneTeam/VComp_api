import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper'

import {
    DeliveryService as TDeliveryService,
    QueryGetDeliveryServiceArgs as TQueryGetDeliveryServiceArgs,
    MutationCreateDeliveryServiceArgs as TMutationCreateDeliveryServiceArgs,
    MutationUpdateDeliveryServiceArgs as TMutationUpdateDeliveryServiceArgs,
    MutationRemoveDeliveryServiceArgs as TMutationRemoveDeliveryServiceArgs,
} from '../../graphql';

export default class DeliveryService extends QueryUtil {
    static resolver(): any {
        this.init('deliveryService');
        return {
            Query: {
                getDeliveryService: (obj: any, args: TQueryGetDeliveryServiceArgs): Promise<TDeliveryService> => {
                    return this.findById(args.id);
                },
                getDeliveryServices: (obj: any, args: any, context: any): Promise<TDeliveryService> => {
                    return context.prisma.deliveryService.findMany();
                },
            },
            Mutation: {
                createDeliveryService: async (obj: any, args: TMutationCreateDeliveryServiceArgs, context: any): Promise<TDeliveryService> => {
                    await this.errorIfExists({ name: args.input?.name }, 'A service with this name has already been created');
                    return context.prisma.deliveryService.create({
                        data: args.input,
                    });
                },
                updateDeliveryService: async (obj: any, args: TMutationUpdateDeliveryServiceArgs, context: any): Promise<TDeliveryService> => {
                    const service = await context.prisma.deliveryService.findUnique({
                        where: {
                            id: args?.id,
                        },
                    });

                    if (!service) {
                        throw new Error('Delivery service not found');
                    }

                    await this.errorIfExists({ name: args.input!.name }, 'A service with this name has already been created');

                    return context.prisma.deliveryService.update({
                        where: {
                            id: args?.id,
                        },
                        data: {
                            name: args.input?.name,
                            isActive: args.input?.isActive,
                            info: args.input?.info,
                        },
                    });
                },
                removeDeliveryService: async (obj: any, args: TMutationRemoveDeliveryServiceArgs, context: any): Promise<TDeliveryService> => {
                    const service = await context.prisma.deliveryService.findUnique({
                        where: {
                            id: args.id,
                        },
                    });

                    if (!service) {
                        throw new Error('Delivery service not found');
                    }
                    return context.prisma.deliveryService.delete({
                        where: {
                            id: args.id,
                        },
                    });
                },
            }
        }
    }

    static typeDefs(): object {
        return gql`
            
            # TYPES
            
            type DeliveryService {
                id: Int!
				name: String!
				isActive: Boolean!
				info: String!
            }

            # INPUTS
            
            input CreateDeliveryServiceInput {
                name: String!
                isActive: Boolean!
                info: String!
            }

            input UpdateDeliveryServiceInput {
                name: String!
                isActive: Boolean!
                info: String!
            }
        `;
    }
}
