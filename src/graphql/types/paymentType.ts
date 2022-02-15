import { gql } from 'apollo-server-express';
import {
    PaymentType as TPaymentType,
    QueryGetPaymentTypesArgs as TQueryGetPaymentTypesArgs,
    QueryGetPaymentTypeArgs as TQueryGetPaymentTypeArgs,
    MutationCreatePaymentTypeArgs as TMutationCreatePaymentTypeArgs,
    MutationRemovePaymentTypeArgs as TMutationRemovePaymentTypeArgs,
    MutationUpdatePaymentTypeArgs as TMutationUpdatePaymentTypeArgs
} from '../../graphql';
import { QueryUtil } from '../../typescript/utils/helper';

export default class PaymentType extends QueryUtil {
    static resolver(): any {
        this.init('paymentType');
        return {
            Query: {
                getPaymentTypes: async (obj: any, {limit, offset}: TQueryGetPaymentTypesArgs, context: any): Promise<Array<TPaymentType>> => {
                    return context.prisma.paymentType.findMany({
                        ...(limit && { take: limit }),
                        ...(offset && { skip: offset }),
                    });
                },
                getPaymentType: async (obj: any, args: TQueryGetPaymentTypeArgs): Promise<TPaymentType> => {
                    return this.findById(args.id);
                },
            },
            Mutation: {
                createPaymentType: async (obj: any, args: TMutationCreatePaymentTypeArgs, context: any): Promise<TPaymentType> => {
                    await this.errorIfExists({ name: args.input.name }, 'A payment type with this name has already been created');
                    return context.prisma.paymentType.create({
                        data: {
                            name: args.input.name,
                            isActive: args.input.isActive,
                            info: args.input.info,
                        },
                    });
                },
                updatePaymentType: async (obj: any, args: TMutationUpdatePaymentTypeArgs, context: any): Promise<TPaymentType> => {
                    await this.findById(args.id);
                    await this.errorIfExists({ name: args.input.name }, 'A payment type with this name has already been created');
                    return context.prisma.paymentType.update({
                        where: {
                            id: args.id,
                        },
                        data: {
                            name: args.input.name,
                            isActive: args.input.isActive,
                            info: args.input.info,
                        },
                    });
                },
                removePaymentType: async (obj: any, args: TMutationRemovePaymentTypeArgs, context: any): Promise<TPaymentType> => {
                    await this.findById(args.id)
                    return context.prisma.paymentType.delete({
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
            
			type PaymentType {
				id: Int!
				name: String!
				isActive: Boolean!
				info: String!
			}
            
            # INPUTS

			input PaymentTypeInput {
				name: String!
				isActive: Boolean = false
				info: String!
			}
        `;
    }
}
