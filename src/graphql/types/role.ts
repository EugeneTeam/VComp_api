import {gql} from 'apollo-server-express';

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
                createRole: (obj: any, args: { name: string }, context: any) => {
                    return context.prisma.role.create({
                        data: {
                            name: args.name,
                        },
                    });
                },
                updateRole: (obj: any, args: { id: number, name: string }, context: any) => context.prisma.role.update({
                    where: {
                        id: args.id,
                    },
                    data: {
                        name: args.name,
                    },
                }),
                removeRole: (obj: any, args: {id: number}, context: any) => context.prisma.delete({
                    where: {
                        id: args.id,
                    },
                })
            }
        }
    }

    static typeDefs() {
        return gql`
            type Role {
                id: Int!
                name: String!
            }
        `;
    }
}
