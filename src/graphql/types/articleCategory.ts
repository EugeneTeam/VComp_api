import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

export default class ArticleCategory extends QueryUtil{
    static resolver() {
        this.init('articleCategory');
        return {
            Query: {
                getArticleCategory: async (obj: any, args: any, context: any) => this.findById(args.id),
                getArticleCategories: async (obj: any, args: any, context: any) => {
                    const pagination = {
                        ...(args?.filter?.limit ? { take: args.filter.limit } : null),
                        ...(args?.filter?.offset ? { skip: args.filter.offset } : null),
                    };

                    const filter = {
                        where: {
                            ...(args.filter.name ? { name: { contains: args.filter.name } } : null),
                        },
                    };

                    return this.findAllAndCount(filter, args?.filter?.limit, args?.filter?.offset)
                }
            },
            Mutation: {
                createArticleCategory: async (obj: any, args: any, context: any) => {
                    await this.errorIfExists({ name: args.input.name }, 'A category with this name has already been created');
                    return context.prisma.articleCategory.create({
                        data: args.input,
                    });
                },
                updateArticleCategory: async (obj: any, args: any, context: any) => {
                    await this.findById(args.id);
                    await this.errorIfExists({ name: args.input.name }, 'A category with this name has already been created');
                    return context.prisma.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeArticleCategory: async (obj: any, args: any, context: any) => {
                    await this.findById(args.id);
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
            type ArticleCategory {
                id: Int!
                name: String!
				parentId: Int
            }
            
            input ArticelCategoryInput {
                name: String!
                parentId: Int
            }
            
            input ArticelCategoryFilter {
                limit: Int
                offset: Int
                name: String
            }
        `;
    }
}
