import { gql } from 'apollo-server';
import { QueryUtil } from "../../typescript/utils/helper";
import { incrementView } from '../../typescript/productView';

import {
    Product as TProduct,
    QueryGetProductArgs as TQueryGetProductArgs,
    QueryGetProductsArgs as TQueryGetProductsArgs,
    MutationCreateProductArgs as TMutationCreateProductArgs,
    MutationUpdateProductArgs as TMutationUpdateProductArgs,
    MutationRemoveProductArgs as TMutationRemoveProductArgs,
    ProductQuantityAndList as TProductQuantityAndList
} from '../../graphql';

export default class Product extends QueryUtil {
    static resolver(): any {
        this.init('product');
        return {
            Query: {
                getProduct: async (obj: any, args: TQueryGetProductArgs, context: any): Promise<TProduct> => {
                    if (context.user.isCustomer) {
                        await incrementView(args.id);
                    }
                    return this.findById(args.id);
                },
                getProducts: async (obj: any, args: TQueryGetProductsArgs): Promise<TProductQuantityAndList> => {
                    return this.findAllAndCount({
                        ...(
                            args?.filter?.name ||
                            args?.filter?.description ||
                            args?.filter?.priceFrom ||
                            args?.filter?.priceTo ||
                            args?.filter?.discountId ||
                            args?.filter?.categoryId ? {
                                where: {
                                    ...(args?.filter?.name && { name: { contains: args.filter.name } }),
                                    ...(args?.filter?.description && { description: { contains: args.filter.description } }),
                                    ...(args?.filter?.priceFrom && { price: { gte: args.filter.priceFrom } }),
                                    ...(args?.filter?.priceTo && { price: { lte: args.filter.priceTo } }),
                                    ...(args?.filter?.categoryId && { categoryId: args.filter.categoryId }),
                                    ...(args?.filter?.discountId && { discountId: args.filter.discountId }),
                                }
                            } : null)
                    }, args?.pagination?.limit, args?.pagination?.offset);
                },
            },
            Mutation: {
                createProduct: async (obj: any, args: TMutationCreateProductArgs, context: any): Promise<TProduct> => {
                    if (args?.input?.discountId) {
                        await this.setAnotherTableForNextRequest('discount');
                        await this.findById(args.input.discountId);
                    }

                    await this.setAnotherTableForNextRequest('gallery');
                    await this.findById(args?.input!.galleryId);

                    await this.setAnotherTableForNextRequest('category');
                    await this.findById(args?.input!.categoryId);

                    return context.prisma.product.create({
                        data: {
                            name: args?.input!.name,
                            description: args?.input!.description,
                            price: args?.input!.price,
                            ...(args?.input?.discountId && { discountId: args.input.discountId }),
                            categoryId: args?.input!.categoryId,
                            galleryId: args?.input!.galleryId,
                        },
                    });
                },
                updateProduct: async (obj: any, args: TMutationUpdateProductArgs, context: any): Promise<TProduct> => {
                    await this.findById(args.id);

                    if (args?.input?.discountId) {
                        await this.setAnotherTableForNextRequest('discount');
                        await this.findById(args.input.discountId);
                    }

                    await this.setAnotherTableForNextRequest('gallery');
                    await this.findById(args?.input!.galleryId);

                    await this.setAnotherTableForNextRequest('category');
                    await this.findById(args?.input!.categoryId);

                    return context.prisma.product.update({
                        where: {
                            id: args.id,
                        },
                        data: {
                            name: args?.input!.name,
                            description: args?.input!.description,
                            price: args?.input!.price,
                            ...(args?.input?.discountId && { discountId: args.input.discountId }),
                            categoryId: args?.input!.categoryId,
                            galleryId: args?.input!.galleryId,
                        },
                    });
                },
                removeProduct: async (obj: any, args: TMutationRemoveProductArgs, context: any): Promise<TProduct> => {
                    await this.findById(args.id);
                    return context.prisma.product.delete({
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
            
            type Product {
                id: Int!
				name: String!
				description: String!
				price: Float!
				discountId: Int
				categoryId: Int!
				galleryId: Int!
				createdAt: String
                updatedAt: String
            }
            
            type ProductQuantityAndList {
                count: Int
                rows: [Product]
            }
            
            # INPUTS
            
            input ProductInput {
				name: String!
				description: String!
				price: Float!
				discountId: Int
				categoryId: Int!
				galleryId: Int!
            }
            
            input ProductFilter {
                name: String
                description: String
                priceFrom: Float
                priceTo: Float
				discountId: Int
                categoryId: Int
            }
            
        `;
    }
}
