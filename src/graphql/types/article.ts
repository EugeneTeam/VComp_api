import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

import {
    Article as TArticle,
    QueryGetArticleArgs as TQueryGetArticleArgs,
    QueryGetArticlesArgs as TQueryGetArticlesArgs,
    MutationCreateArticleArgs as TMutationCreateArticleArgs,
    MutationUpdateArticleArgs as TMutationUpdateArticleArgs,
    MutationRemoveArticleArgs as TMutationRemoveArticleArgs,
    ArticleCategoryQuantityAndList as TArticleCategoryQuantityAndList,
} from '../../graphql';
import {GraphQLType} from "graphql/index";

export default class Article extends QueryUtil{
    static resolver(): any {
        this.init('article');
        return {
            Query: {
                getArticles: async (obj: any, args: TQueryGetArticlesArgs): Promise<TArticleCategoryQuantityAndList> => {
                    const filter = {
                        where: {
                            ...(args?.filter?.categoryId && { articleCategoryId: args.filter.categoryId }),
                            ...(args?.filter?.title && { title: { contains: args.filter.title} }),
                            ...(args?.filter?.text && { text: { contains: args.filter.text} }),
                            ...(args?.filter?.status && { status: args.filter.status }),
                        },
                    };

                    return this.findAllAndCount(filter, args?.pagination?.limit, args?.pagination?.offset);
                },
                getArticle: async (obj: any, args: TQueryGetArticleArgs): Promise<TArticle> => {
                    return this.findById(args.id);
                },
            },
            Mutation: {
                createArticle: async (obj: any, args: TMutationCreateArticleArgs, context: any): Promise<TArticle> => {
                    await this.setAnotherTableForNextRequest('articleCategory');
                    await this.findById(args.input.articleCategoryId);
                    return context.prisma.article.create({
                        data: {
                            articleCategoryId: args.input.articleCategoryId,
                            title: args.input.title,
                            text: args.input.text,
                            image: args.input.image,
                            status: args.input.status,
                            source: args?.input?.source,
                        },
                    });
                },
                updateArticle: async (obj: any, args: TMutationUpdateArticleArgs, context: any): Promise<TArticle> => {
                    await this.setAnotherTableForNextRequest('articleCategory');
                    await this.findById(args.input.articleCategoryId);
                    await this.findById(args.id);
                    const article: Promise<TArticle> = await context.prisma.article.update({
                        where: {
                            id: args.id,
                        },
                        data: {
                            articleCategoryId: args.input.articleCategoryId,
                            title: args.input.title,
                            text: args.input.text,
                            image: args.input.image,
                            status: args.input.status,
                            source: args.input.source,
                        },
                    });

                    if (!article) {
                        throw new Error('Article not found');
                    }
                    return article;
                },
                removeArticle: async (obj: any, args: TMutationRemoveArticleArgs, context: any): Promise<TArticle> => {
                    await this.findById(args.id)
                    return context.prisma.article.delete({
                        where: {
                            id: args.id,
                        },
                    });
                }
            }
        }
    }

    static typeDefs(): object {
        return gql`
            
            # ENUMS
            
            enum ArticleStatus {
                HIDDEN
                VISIBLE
            }
            
            # TYPES
            
			type ArticleResponse {
				count: Int!
				rows: [Article]!
			}

			type Article {
				id: Int!
				articleCategoryId: Int
				title: String!
				text: String!
				image: String!
				status: ArticleStatus
				source: String
			}
            
            # INPUTS
            
            input ArticleFilter {
                categoryId: Int
				title: String
                text: String
                status: ArticleStatus = HIDDEN
            }
            
            input ArticleInput {
                articleCategoryId: Int!
                title: String!
                text: String!
                image: String!
                status: ArticleStatus = HIDDEN
				source: String = null
            }
        `;
    }
}
