import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';
import {
    Category as ICategory,
    CategoryQuantityAndList as ICategoryQuantityAndList,
    QueryGetCategoryArgs as IQueryGetCategoryArgs,
    QueryGetCategoriesArgs as IQueryGetCategoriesArgs,
    MutationCreateCategoryArgs as IMutationCreateCategoryArgs,
    MutationRemoveCategoryArgs as IMutationRemoveCategoryArgs,
    MutationUpdateCategoryArgs as IMutationUpdateCategoryArgs
} from '../../graphql';


export default class Category extends QueryUtil {
    static resolver() {
        this.init('category');
        return {
            Query: {
                getCategory: (obj: any, args: IQueryGetCategoryArgs): Promise<ICategory> => this.findById(args.id),
                getCategories: (obj: any, args: IQueryGetCategoriesArgs): Promise<ICategoryQuantityAndList> => {
                    return this.findAllAndCount(null, args?.pagination?.limit, args?.pagination?.offset)
                },
            },
            Mutation: {
                createCategory: async (obj: any, args: IMutationCreateCategoryArgs, context: any): Promise<Category> => {
                    await this.errorIfExists({ name: args?.input?.name }, 'A category with this name has already been created');
                    return context.prisma.category.craete({
                        data: args.input,
                    });
                },
                updateCategory: async (obj: any, args: IMutationUpdateCategoryArgs, context: any): Promise<Category> => {
                    await this.findById(args.id);
                    await this.errorIfExists({ name: args?.input?.name }, 'A category with this name has already been created');
                    return context.prisma.category.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeCategory: async (obj: any, args: IMutationRemoveCategoryArgs, context: any): Promise<Category> => {
                    await this.findById(args.id);
                    return context.prisma.category.delete({
                        where: {
                            id: args.id,
                        },
                    });
                }
            },
        }
    }
    static typeDefs() {
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
