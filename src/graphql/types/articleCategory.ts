import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

import {
    ArticleCategory as TArticleCategory,
    MutationCreateArticleCategoryArgs as TMutationCreateArticleCategoryArgs,
    MutationRemoveArticleCategoryArgs as TMutationRemoveArticleCategoryArgs,
    MutationUpdateArticleCategoryArgs as TMutationUpdateArticleCategoryArgs,
    QueryGetArticleCategoriesArgs as TQueryGetArticleCategoriesArgs,
    QueryGetArticleCategoryArgs as TQueryGetArticleCategoryArgs,
    ArticleCategoryQuantityAndList as TArticleCategoryQuantityAndList,
} from '../../graphql';

export default class ArticleCategory extends QueryUtil {
    static resolver(): any {
        this.init('articleCategory');
        return {
            Query: {
                getArticleCategory: async (obj: any, args: TQueryGetArticleCategoryArgs): Promise<TArticleCategory> => {
                    return this.findById(args.id);
                },
                getArticleCategories: async (obj: any, args: TQueryGetArticleCategoriesArgs): Promise<TArticleCategoryQuantityAndList> => {
                    const filter = {
                        where: {
                            ...(args?.filter?.name && { name: { contains: args.filter.name } }),
                        },
                    };
                    return this.findAllAndCount(filter, args?.pagination?.limit, args?.pagination?.offset);
                }
            },
            Mutation: {
                createArticleCategory: async (obj: any, args: TMutationCreateArticleCategoryArgs, context: any): Promise<TArticleCategory> => {
                    await this.errorIfExists({ name: args.input.name }, 'A category with this name has already been created');
                    return context.prisma.articleCategory.create({
                        data: args.input,
                    });
                },
                updateArticleCategory: async (obj: any, args: TMutationUpdateArticleCategoryArgs, context: any): Promise<TArticleCategory> => {
                    await this.findById(args.id);
                    await this.errorIfExists({ name: args.input.name }, 'A category with this name has already been created');
                    return context.prisma.articleCategory.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeArticleCategory: async (obj: any, args: TMutationRemoveArticleCategoryArgs, context: any): Promise<TArticleCategory> => {
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
    static typeDefs(): object {
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
