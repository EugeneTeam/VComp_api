import { gql } from 'apollo-server';
import {
    DeliveryService as IDeliveryService,
    QueryGetDeliveryServiceArgs as IQueryGetDeliveryServiceArgs,
    MutationCreateDeliveryServiceArgs as IMutationCreateDeliveryServiceArgs,
    MutationUpdateDeliveryServiceArgs as IMutationUpdateDeliveryServiceArgs,
    MutationRemoveDeliveryServiceArgs as IMutationRemoveDeliveryServiceArgs,
} from '../../graphql';
import { QueryUtil } from '../../typescript/utils/helper'
export default class DeliveryService extends QueryUtil {
    static resolver() {
        this.init('deliveryService');
        return {
            Query: {
                getDeliveryService: (obj: any, args: IQueryGetDeliveryServiceArgs): Promise<IDeliveryService> => this.findById(args.id),
                getDeliveryServices: (obj: any, args: any, context: any): Promise<IDeliveryService> => context.prisma.deliveryService.findMany(),
            },
            Mutation: {
                createDeliveryService: async (obj: any, args: IMutationCreateDeliveryServiceArgs, context: any): Promise<IDeliveryService> => {
                    await this.errorIfExists({ name: args.input!.name }, 'A service with this name has already been created');
                    return context.prisma.deliveryService.create({
                        data: args.input,
                    });
                },
                updateDeliveryService: async (obj: any, args: IMutationUpdateDeliveryServiceArgs, context: any): Promise<IDeliveryService> => {
                    const service = await context.prisma.deliveryService.findUnique({
                        where: {
                            id: args.input!.id,
                        },
                    });

                    if (!service) {
                        throw new Error('Delivery service not found');
                    }

                    await this.errorIfExists({ name: args.input!.name }, 'A service with this name has already been created');

                    return context.prisma.deliveryService.update({
                        where: {
                            id: args.input!.id,
                        },
                        data: {
                            name: args.input!.name,
                            isActive: args.input!.isActive,
                            info: args.input!.info,
                        },
                    });
                },
                removeDeliveryService: async (obj: any, args: IMutationRemoveDeliveryServiceArgs, context: any): Promise<IDeliveryService> => {
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

    static typeDefs() {
        return gql`
            type DeliveryService {
                id: Int!
				name: String!
				isActive: Boolean!
				info: String!
            }

            input CreateDeliveryServiceInput {
                name: String!
                isActive: Boolean!
                info: String!
            }

            input UpdateDeliveryServiceInput {
                id: Int!
                name: String!
                isActive: Boolean!
                info: String!
            }
        `;
    }
}
