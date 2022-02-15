import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

import {
    Comment as TComment,
    CommentQuantityAndList as TCommentQuantityAndList,
    MutationAddCommentArgs as TMutationAddCommentArgs,
    MutationRemoveCommentArgs as TMutationRemoveCommentArgs,
    QueryGetCommentArgs as TQueryGetCommentArgs,
    QueryGetCommentsArgs as TQueryGetCommentsArgs
} from '../../graphql';

export default class Comment extends QueryUtil {
    static resolver(): any {
        this.init('comment');
        return {
            Query: {
                getComment: (obj: any, args: TQueryGetCommentArgs): Promise<TComment> => {
                    return this.findById(args.id);
                },
                getComments: async (obj: any, args: TQueryGetCommentsArgs): Promise<TCommentQuantityAndList> => {
                    return this.findAllAndCount({
                            where: {
                                ...(args?.filter?.rating && { rating: args.filter.rating }),
                                ...(args?.filter?.search && {
                                    AND: [
                                        { description: { contains: args.filter.search } },
                                        { flaws: { contains: args.filter.search } },
                                        { dignity: { contains: args.filter.search } },
                                    ]
                                }),
                                ...(args?.filter?.userId && { userId: args.filter.userId }),
                                ...(args?.filter?.productId && { productId: args.filter.productId }),                     }
                        }, args?.pagination?.limit, args?.pagination?.offset);
                },
            },
            Mutation: {
                addComment: async (obj: any, args: TMutationAddCommentArgs, context: any): Promise<TComment> => {
                    if (args?.input?.rating && (args.input.rating > 5 || args.input.rating < 0)) {
                        throw new Error('The rating must be in the range of from 1 to 5');
                    }
                    return context.prisma.comment.create({
                        data: {
                            userId: context.user.id,
                            ...args.input,
                        },
                    });
                },
                removeComment: async (obj: any, args: TMutationRemoveCommentArgs, context: any) => {
                    await this.findById(args.id);
                    return context.prisma.comment.delete({
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
