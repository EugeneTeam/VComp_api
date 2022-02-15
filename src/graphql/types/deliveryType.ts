import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

import {
    DeliveryService as TDeliveryService,
    QueryGetDeliveryServiceArgs as TQueryGetDeliveryServiceArgs,
    MutationCreateDeliveryServiceArgs as TMutationCreateDeliveryServiceArgs,
    MutationUpdateDeliveryServiceArgs as TMutationUpdateDeliveryServiceArgs,
    MutationRemoveDeliveryServiceArgs as TMutationRemoveDeliveryServiceArgs
} from '../../graphql';

export default class DeliveryType extends QueryUtil {
    static resolver(): any {
        this.init('deliveryType');
        return {
            Query: {
                getDeliveryType: (obj: any, args: TQueryGetDeliveryServiceArgs): Promise<TDeliveryService> => {
                    return this.findById(args.id);
                },
                getDeliveryTypes: (obj: any, args: any, context: any): Promise<Array<TDeliveryService>> => {
                    return context.prisma.deliveryType.findMany();
                },
            },
            Mutation: {
                createDeliveryType: async (obj: any, args: TMutationCreateDeliveryServiceArgs, context: any): Promise<TDeliveryService> => {
                    await this.errorIfExists({ name: args.input!.name }, 'A delivery type with this name has already been created');
                    return context.prisma.deliveryType.create({
                        data: args.input,
                    });
                },
                updateDeliveryType: async (obj: any, args: TMutationUpdateDeliveryServiceArgs, context: any): Promise<TDeliveryService> => {
                    await this.findById(args.id);
                    await this.errorIfExists({ name: args.input!.name }, 'A delivery type with this name has already been created');
                    return context.prisma.deliveryType.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeDeliveryType: async (obj: any, args: TMutationRemoveDeliveryServiceArgs, context: any): Promise<TDeliveryService> => {
                    await this.findById(args.id);
                    return context.prisma.deliveryType.delete({
                        where: {
                            id: args.id,
                        },
                    });
                },
            },
        }
    }
    static typeDefs(): object {
        return gql`
            
            # TYPES
            
			type DeliveryType {
				id: Int!
				name: String!
				isActive: Boolean!
				info: String!
			}

            # INPUTS
            
			input CreateDeliveryTypeInput {
				name: String!
				isActive: Boolean!
				info: String!
			}
        `;
    }
}
