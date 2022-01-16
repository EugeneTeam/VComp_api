import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';
import {
    Article as IArticle,
    QueryGetArticleArgs as IQueryGetArticleArgs,
    QueryGetArticlesArgs as IQueryGetArticlesArgs,
    MutationCreateArticleArgs as IMutationCreateArticleArgs,
    MutationUpdateArticleArgs as IMutationUpdateArticleArgs,
    MutationRemoveArticleArgs as IMutationRemoveArticleArgs
} from '../../graphql';

export default class Article extends QueryUtil{
    static resolver() {
        this.init('article');
        return {
            Query: {
                getArticles: async (obj: any, args: IQueryGetArticlesArgs): Promise<{ count: number, rows: Array<IArticle | null> }> => {
                    const filter = {
                        where: {
                            ...(args?.filter?.categoryId ? {articleCategoryId: args.filter.categoryId} : null),
                            ...(args?.filter?.title ? {title: {contains: args.filter.title}} : null),
                            ...(args?.filter?.text ? {text: {contains: args.filter.text}} : null),
                            ...(args?.filter?.status ? {status: args.filter.status} : null),
                        },
                    };

                    return this.findAllAndCount(filter, args?.filter?.limit, args?.filter?.offset);
                },
                getArticle: async (obj: any, args: IQueryGetArticleArgs): Promise<IArticle> => this.findById(args.id),
            },
            Mutation: {
                createArticle: async (obj: any, args: IMutationCreateArticleArgs, context: any): Promise<IArticle> => {
                    await this.setAnotherTableForNextRequest('articleCategory');
                    await this.findById(args.input.articleCategoryId);
                    return context.prisma.article.create({
                        data: {
                            articleCategoryId: args.input.articleCategoryId,
                            title: args.input.title,
                            text: args.input.text,
                            image: args.input.imageUrl,
                            status: args.input.status,
                            source: args?.input?.source,
                        },
                    });
                },
                updateArticle: async (obj: any, args: IMutationUpdateArticleArgs, context: any): Promise<IArticle> => {
                    await this.setAnotherTableForNextRequest('articleCategory');
                    await this.findById(args.input.articleCategoryId);
                    await this.findById(args.id);
                    const article: Promise<IArticle> | null = await context.prisma.article.update({
                        where: {
                            id: args.id,
                        },
                        data: {
                            articleCategoryId: args.input.articleCategoryId,
                            title: args.input.title,
                            text: args.input.text,
                            image: args.input.imageUrl,
                            status: args.input.status,
                            source: args.input.source,
                        },
                    });

                    if (!article) {
                        throw new Error('Article not found');
                    }
                    return article;
                },
                removeArticle: async (obj: any, args: IMutationRemoveArticleArgs, context: any): Promise<IArticle> => {
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

    static typeDefs() {
        return gql`            
            enum ArticleStatus {
                HIDDEN
                VISIBLE
            }
            
            input ArticleFilter {
                categoryId: Int
				title: String
                text: String
                status: ArticleStatus = HIDDEN
                limit: Int = 25
                offset: Int = 0
            }
            
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
            
            input ArticelInput {
                articleCategoryId: Int!
                title: String!
                text: String!
                imageUrl: String!
                status: ArticleStatus = HIDDEN
				source: String = null
            }
        `;
    }
}
