import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

export default class Comment extends QueryUtil {
    static resolver() {
        return {
            Query: {
                getComment: (obj: any, args: any) => this.findById(args.id),
                getComments: async (obj: any, args: any, context: any) => {
                    return this.findAllAndCount({
                            where: {
                                ...(args?.filter?.rating ? { rating: args.filter.rating } : null),
                                ...(args?.filter?.search ? {
                                    AND: [
                                        { description: { contains: args.filter.search } },
                                        { flaws: { contains: args.filter.search } },
                                        { dignity: { contains: args.filter.search } },
                                    ]
                                } : null),
                                ...(args?.filter?.userId ? { userId: args.input.userId } : null),
                                ...(args?.filter?.productId ? { productId: args.input.productId } : null),                     }
                        }, args?.pagination?.limit, args?.pagination?.offset);
                },
            },
            Mutation: {
                addComment: async (obj: any, args: any, context: any) => {
                    if (args.input.rating > 5 || args.input.rating) {
                        throw new Error('The score must be in the range of 1-5');
                    }
                    return context.prisma.comment.create({
                        data: {
                            userId: context.user.id,
                            ...args.input,
                        },
                    });
                },
                removeComment: async (obj: any, args: any, context: any) => {
                    await this.findById(args.id);
                    return context.prisma.comment.delete({
                        where: {
                            id: args.id,
                        },
                    })
                }
            },
        }
    }
    static typeDefs() {
        return gql`
            
            # ENUMS
            
            enum CommentType {
                QUESTION
                COMMENT
            }
            
            # TYPES
            
            type Comment {
                id: Int!
                type: CommentType!
                rating: Int!
                description: String
                flaws: String
                dignity: String
                userId: Int!
                productId: Int!
                parentId: Int
            }
            
            type CommentQuantityAndList {
                count: Int
                rows: [Comment]
			}
            
            # INPUTS
            
            input AddComment {
				type: CommentType!
				rating: Int!
				description: String
				flaws: String
				dignity: String
				productId: Int!
				parentId: Int
            }
            
            input CommentFilter {
                rating: Int
                search: String
                userId: Int
                productId: Int
            }
        `;
    }
}
