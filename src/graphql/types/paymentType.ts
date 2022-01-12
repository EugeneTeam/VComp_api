import {gql} from 'apollo-server-express';
import {
    checkPaymentTypeName,
    getPaymentTypeById
} from "../../typescript/paymentType";
import {
    PaymentType as IPaymentType,
    QueryGetPaymentTypesArgs as IQueryGetPaymentTypesArgs,
    QueryGetPaymentTypeArgs as IQueryGetPaymentTypeArgs,
    MutationCreatePaymentTypeArgs as IMutationCreatePaymentTypeArgs,
    MutationRemovePaymentTypeArgs as IMutationRemovePaymentTypeArgs,
    MutationUpdatePaymentTypeArgs as IMutationUpdatePaymentTypeArgs
} from '../../graphql';

export default class PaymentType {
    static resolver() {
        return {
            Query: {
                getPaymentTypes: async (obj: any, {limit, offset}: IQueryGetPaymentTypesArgs, context: any): Promise<IPaymentType> => context.prisma.role.findMany({
                    ...(limit ? {take: limit} : null),
                    ...(offset ? {skip: offset} : null),
                }),
                getPaymentType: async (obj: any, args: IQueryGetPaymentTypeArgs): Promise<IPaymentType> => await getPaymentTypeById(args.id),
            },
            Mutation: {
                createPaymentType: async (obj: any, args: IMutationCreatePaymentTypeArgs, context: any): Promise<IPaymentType> => {
                    await checkPaymentTypeName(args.input.name)

                    return context.prisma.paymentType.create({
                        data: {
                            name: args.input.name,
                            isActive: args.input.isActive,
                            info: args.input.info,
                        },
                    });
                },
                updatePaymentType: async (obj: any, args: IMutationUpdatePaymentTypeArgs, context: any): Promise<IPaymentType> => {
                    await getPaymentTypeById(args.id);
                    await checkPaymentTypeName(args.input.name);

                    return context.prisma.paymentType.update({
                        where: {
                            id: args.id,
                        },
                        data: {
                            name: args.input.name,
                            isActive: args.input.isActive,
                            info: args.input.info,
                        }
                    });
                },
                removePaymentType: async (obj: any, args: IMutationRemovePaymentTypeArgs, context: any): Promise<IPaymentType> => {
                    await getPaymentTypeById(args.id);
                    return context.prisma.paymentType.delete({
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
            input PaymentTypeInput {
                name: String!
                isActive: Boolean = false
                info: String!
            }
            
            type PaymentType {
				id: Int!
				name: String!
				isActive: Boolean!
				info: String!
			}
        `;
    }
}
