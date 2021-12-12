import {gql} from 'apollo-server-express'
import {PrismaClient} from "@prisma/client";

export default class Role {
    static resolver() {
        return {
            Query: {
                getRoles: async (obj: any, {limit, offset}: any, context: any) => context.prisma.role.findMany({
                        ...(limit ? {take: limit} : null),
                        ...(offset ? {skip: offset} : null),
                    })
            },
            Mutation: {
                createRole: (next: any, args: {name: string}, context: any) => {
                    return context.prisma.role.create({
                        data: {
                            name: args.name
                        }
                    })
                },
            }
        }
    }

    static typeDefs() {
        return gql`
            type Role {
                id: Int!
                name: String!
            }
        `
    }
}
