import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';
import {
    Category as TCategory,
    CategoryQuantityAndList as TCategoryQuantityAndList,
    QueryGetCategoryArgs as TQueryGetCategoryArgs,
    QueryGetCategoriesArgs as TQueryGetCategoriesArgs,
    MutationCreateCategoryArgs as TMutationCreateCategoryArgs,
    MutationRemoveCategoryArgs as TMutationRemoveCategoryArgs,
    MutationUpdateCategoryArgs as TMutationUpdateCategoryArgs
} from '../../graphql';


export default class Category extends QueryUtil {
    static resolver(): any {
        this.init('category');
        return {
            Query: {
                getCategory: (obj: any, args: TQueryGetCategoryArgs): Promise<TCategory> => {
                    return this.findById(args.id)
                },
                getCategories: (obj: any, args: TQueryGetCategoriesArgs): Promise<TCategoryQuantityAndList> => {
                    return this.findAllAndCount(null, args?.pagination?.limit, args?.pagination?.offset)
                },
            },
            Mutation: {
                createCategory: async (obj: any, args: TMutationCreateCategoryArgs, context: any): Promise<TCategory> => {
                    await this.errorIfExists({ name: args?.input?.name }, 'A category with this name has already been created');
                    return context.prisma.category.create({
                        data: args.input,
                    });
                },
                updateCategory: async (obj: any, args: TMutationUpdateCategoryArgs, context: any): Promise<TCategory> => {
                    await this.findById(args.id);
                    await this.errorIfExists({ name: args?.input?.name }, 'A category with this name has already been created');
                    return context.prisma.category.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeCategory: async (obj: any, args: TMutationRemoveCategoryArgs, context: any): Promise<TCategory> => {
                    await this.findById(args.id);
                    await context.prisma.category.updateMany({
                        where: {
                            parentId: args.id,
                        },
                        data: {
                            parentId: null,
                        },
                    });
                    await context.prisma.characteristic.deleteMany({
                        where: {
                            categoryId: args.id,
                        },
                    });
                    await context.prisma.product.deleteMany({
                        where: {
                            categoryId: args.id,
                        },
                    });
                    return context.prisma.category.delete({
                        where: {
                            id: args.id,
                        },
                    });
                }
            },
        }
    }
    static typeDefs(): object {
        return gql`
            
            # TYPES
            
            type Category {
                id: Int
                name: String
                parentId: Int
            }
            
            type CategoryQuantityAndList {
                count: Int
                rows: [Category]
            }
            
            # INPUTS
            
            input CategoryInput {
                name: String!
                parentId: Int
            }
        `;
    }
}
