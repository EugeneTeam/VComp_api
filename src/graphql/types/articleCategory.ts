import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

import {
    ArticleCategory as IArticleCategory,
    MutationCreateArticleCategoryArgs as IMutationCreateArticleCategoryArgs,
    MutationRemoveArticleCategoryArgs as IMutationRemoveArticleCategoryArgs,
    MutationUpdateArticleCategoryArgs as IMutationUpdateArticleCategoryArgs,
    QueryGetArticleCategoriesArgs as IQueryGetArticleCategoriesArgs,
    QueryGetArticleCategoryArgs as IQueryGetArticleCategoryArgs,
    ArticleCategoryQuantityAndList as IArticleCategoryQuantityAndList,
} from '../../graphql';

export default class ArticleCategory extends QueryUtil {
    static resolver() {
        this.init('articleCategory');
        return {
            Query: {
                getArticleCategory: async (obj: any, args: IQueryGetArticleCategoryArgs): Promise<IArticleCategory> => this.findById(args.id),
                getArticleCategories: async (obj: any, args: IQueryGetArticleCategoriesArgs): Promise<IArticleCategoryQuantityAndList> => {
                    const filter = {
                        where: {
                            ...(args?.filter?.name ? { name: { contains: args.filter.name } } : null),
                        },
                    };
                    return this.findAllAndCount(filter, args?.pagination?.limit, args?.pagination?.offset)
                }
            },
            Mutation: {
                createArticleCategory: async (obj: any, args: IMutationCreateArticleCategoryArgs, context: any): Promise<IArticleCategory> => {
                    await this.errorIfExists({ name: args.input.name }, 'A category with this name has already been created');
                    return context.prisma.articleCategory.create({
                        data: args.input,
                    });
                },
                updateArticleCategory: async (obj: any, args: IMutationUpdateArticleCategoryArgs, context: any): Promise<IArticleCategory> => {
                    await this.findById(args.id);
                    await this.errorIfExists({ name: args.input.name }, 'A category with this name has already been created');
                    return context.prisma.articleCategory.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeArticleCategory: async (obj: any, args: IMutationRemoveArticleCategoryArgs, context: any): Promise<IArticleCategory> => {
                    await this.findById(args.id);
                    await this.setAnotherTableForNextRequest('article');
                    await this.errorIfExists({
                        articleCategoryId: args.id,
                    }, 'This category is used in the article');
                    return context.prisma.articleCategory.delete({
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
            
            type ArticleCategory {
                id: Int!
                name: String!
				parentId: Int
            }
            
            type ArticleCategoryQuantityAndList {
                count: Int
                rows: [ArticleCategory]
            }
            
            # INPUTS
            
            input ArticleCategoryInput {
                name: String!
                parentId: Int
            }
            
            input ArticleCategoryFilter {
                name: String
            }
        `;
    }
}
