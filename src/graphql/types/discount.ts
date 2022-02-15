import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

import {
    Discount as TDiscount,
    QueryGetDiscountArgs as TQueryGetDiscountArgs,
    QueryGetDiscountsArgs as TQueryGetDiscountsArgs,
    MutationAddDiscountArgs as TMutationAddDiscountArgs,
    MutationUpdateDiscountArgs as TMutationUpdateDiscountArgs,
    MutationRemoveDiscountArgs as TMutationRemoveDiscountArgs
} from '../../graphql';

export default class Discount extends QueryUtil {
    static resolver(): any {
        this.init('discount');
        return {
            Query: {
                getDiscount: (obj: any, args: TQueryGetDiscountArgs): Promise<TDiscount> => {
                    return this.findById(args.id);
                },
                getDiscounts: (obj: any, args: TQueryGetDiscountsArgs) => {
                    return this.findAllAndCount(null, args?.pagination?.limit, args?.pagination?.offset);
                },
            },
            Mutation: {
                addDiscount: async (obj: any, args: TMutationAddDiscountArgs, context: any) => {
                    return context.prisma.discount.create({
                        data: args.input,
                    });
                },
                updateDiscount: async (obj: any, args: TMutationUpdateDiscountArgs, context: any) => {
                    await this.findById(args.id);
                    return context.prisma.discount.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeDiscount: async (obj: any, args: TMutationRemoveDiscountArgs, context: any) => {
                    await this.findById(args.id);
                    return context.prisma.discount.delete({
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
            
            # ENUMS
            
            enum DiscountType {
                VALUE
                PERCENT
            }
            
            # TYPES
            
            type Discount {
                id: Int!
                type: DiscountType!
                value: Float!
                expiredAt: String!
            }
            
            type DiscountQuantityAndList {
                count: Int
                rows: [Discount]
            }
            
            # INPUTS
            
            input DiscountInput {
				type: DiscountType!
				value: Float!
				expiredAt: String!
            }
            
        `;
    }
}
