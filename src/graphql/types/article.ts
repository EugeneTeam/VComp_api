import {gql} from 'apollo-server';
import {
    getArticleCategoryById,
} from '../../typescript/articleCategory';
import {
    IArticle,
    getArticleById,
} from '../../typescript/article';

export default class Article {
    static resolver() {
        return {
            Query: {
                getArticles: async (obj: any, args: any, context: any) => {
                    const pagination = {
                        ...(args?.filter?.limit ? {take: args.filter.limit} : null),
                        ...(args?.filter?.offset ? {skip: args.filter.offset} : null),
                    };

                    const filter = {
                        where: {
                            ...(args?.filter?.categoryId ? {articleCategoryId: args.filter.categoryId} : null),
                            ...(args?.filter?.name ? {title: {contains: args.filter.name}} : null),
                            ...(args?.filter?.text ? {text: {contains: args.filter.name}} : null),
                            ...(args?.filter?.status ? {status: args.filter.status} : null),
                        },
                    };

                    const count = await context.prisma.article.aggregate({
                        _count: {
                            id: true,
                        },
                        ...filter,
                    });

                    const articles = await context.prisma.article.findMany({
                        ...pagination,
                        ...filter,
                    });

                    return {
                        count: count?._count.id,
                        rows: articles,
                    };
                },
                getArticle: async (obj: any, args: any, context: any) => getArticleById(args.id),
            },
            Mutation: {
                createArticle: async (obj: any, args: any, context: any) => {
                    await getArticleCategoryById(args.input.articleCategoryId);
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
                updateArticle: async (obj: any, args: any, context: any) => {
                    await getArticleCategoryById(args.input.articleCategoryId);
                    await getArticleById(args.id)
                    const article: Promise<IArticle> | null = await context.prisma.article.update({
                        where: {
                            id: args.articleId.id,
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
                removeArticle: async (obj: any, args: any, context: any) => {
                    await getArticleById(args.id)
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
                articleCategoryId: Int = null
                title: String!
                text: String!
                imageUrl: String!
                status: ArticleStatus = HIDDEN
				source: String = null
            }
        `;
    }
}
