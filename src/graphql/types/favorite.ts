import {gql} from 'apollo-server';

export default class Favorite {
    static resolver() {
        return {
            Mutation: {
                addOrRemoveFavorite: async (obj: any, args: any, context: any) => {
                    const checkFavorite = await context.prisma.favorite.findUnique({
                        where: {
                            // this name is spelled out in the prism circuit
                            favoriteProduct: {
                                userId: context.user.id,
                                productId: args.input.productId,
                            },
                        },
                    });

                    if (!checkFavorite) {
                        const checkProduct = await context.prisma.product.findUnique({
                            where: {
                                id: args.input.productId,
                            },
                        });

                        if (!checkProduct) {
                            throw new Error('Product not found');
                        }

                        return context.prisma.favorite.create({
                            data: {
                                userId: context.user.id,
                                productId: args.input.productId,
                            },
                        });
                    } else {
                        return context.prisma.favorite.delete({
                            where: {
                                // this name is spelled out in the prism circuit
                                favoriteProduct: {
                                    userId: context.user.id,
                                    productId: args.input.productId,
                                },
                            },
                        });
                    }
                }
            },
        }
    }

    static typeDefs() {
        return gql`            
            input FavoriteIpnut {
                productId: Int!
            }
            
            type Favorite {
				id: Int!
				productId: Int!
				userId: Int!
            }
        `;
    }
}
