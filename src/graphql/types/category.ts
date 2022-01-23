import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper'

export default class Category extends QueryUtil {
    static resolver() {
        this.init('category');
        return {
            Query: {
                getCategory: (obj: any, args: any) => this.findById(args.id),
                getCategories: (obj: any, args: any) => this.findAllAndCount(null, args?.pagination?.limit, args?.pagination?.offset),
            },
            Mutation: {
                createCategory: async (obj: any, args: any, context: any) => {
                    await this.errorIfExists({ name: args.input.name }, 'A category with this name has already been created');
                    return context.prisma.category.craete({
                        data: args.input,
                    });
                },
                updateCategory: async (obj: any, args: any, context: any) => {
                    await this.findById(args.id);
                    await this.errorIfExists({ name: args.input.name }, 'A category with this name has already been created');
                    return context.prisma.category.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeCategory: async (obj: any, args: any, context: any) => {
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
            
            type CategoryQuantityAndLisr {
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
