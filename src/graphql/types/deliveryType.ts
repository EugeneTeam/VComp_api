import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

export default class DeliveryType extends QueryUtil {
    static resolver() {
        return {
            Query: {
                getDeliveryType: (obj: any, args: any) => this.findById(args.id),
                getDeliveryTypes: (obj: any, args: any, context: any) => context.prisma.deliveryType.findMany(),
            },
            Mutation: {
                createDeliveryType: async (obj: any, args: any, context: any) => {
                    await this.checkByField('name', args.input!.name, true)
                    return context.prisma.deliveryType.create({
                        data: args.input,
                    });
                },
                updateDeliveryType: async (obj: any, args: any, context: any) => {
                    await this.findById(args.id);
                    await this.checkByField('name', args.input!.name, true);
                    return context.prisma.deliveryType.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeDeliveryType: async (obj: any, args: any, context: any) => {
                    await this.findById(args.id);
                    return context.prisma.deliveryService.delete({
                        where: {
                            id: args.id,
                        },
                    });
                },
            },
        }
    }
    static typeDefs() {
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
