import { gql } from 'apollo-server';
import { QueryUtil } from "../../typescript/utils/helper";

// TODO Awaiting improvements

export default class Order extends QueryUtil {
    static resolver(): any {
        this.init('order');
        return {
            Query: {
                getOrder: async (obj: any, args: any) => this.findById(args.id),
                getOrders: async (obj: any, args: any, context: any) => {
                    return this.findAllAndCount({

                    },
                    args?.pagination?.limit,
                    args?.pagination?.offset);
                },
            },
            Mutation: {
                createOrder: async (obj: any, args: any, context: any) => {
                    await this.setAnotherTableForNextRequest('paymentType');
                    await this.findById(args.input.paymentTypeId);

                    await this.setAnotherTableForNextRequest('deliveryType');
                    await this.findById(args.input.deliveryTypeId);

                    // productIds
                    const newOrder = await context.prisma.order.create({
                        data: {
                            paymentTypeId: args.input.paymentTypeId,
                            deliveryTypeId: args.input.deliveryTypeId,
                            comment: args.input.comment,
                            callback: args.input.callback,
                            status: 'PROCESSED',
                            userId: context.user.id,
                        },
                    });

                    for (const product of args.input.productIds) {
                        await context.prisma.lProductList.create({
                            data: {
                                quantity: product.quantity,
                                productId: product.productId,
                                orderId: newOrder.id,
                            },
                        });
                    }

                    return newOrder;
                },
                updateOrder: () => {},
                removeOrder: () => {},
            },
        }
    }
    static typeDefs() {
        return gql`            
            # INPUTS
            
            input OrderFilter {
				paymentTypeId: Int
				deliveryTypeId: Int
            }
            
            input ProductList {
                productId: Int!
                quantity: Int! = 1
            }
            
            input OrderInput {
                paymentTypeId: Int!
                deliveryTypeId: Int!
                comment: String
                callback: Boolean = false
                productIds: [ProductList]
            }
        `;
    }
}
