import {gql} from 'apollo-server-express';
import {
    Role as IRole,
    QueryGetRolesArgs as IQueryGetRolesArgs,
    MutationCreateRoleArgs as IMutationCreateRoleArgs,
    MutationRemoveRoleArgs as IMutationRemoveRoleArgs,
    MutationUpdateRoleArgs as IMutationUpdateRoleArgs,
} from '../../graphql';

export default class Role {
    static resolver() {
        return {
            Query: {
                getRoles: async (obj: any, {limit, offset}: IQueryGetRolesArgs, context: any): Promise<IRole> => context.prisma.role.findMany({
                        ...(limit ? {take: limit} : null),
                        ...(offset ? {skip: offset} : null),
                    })
            },
            Mutation: {
                createRole: (obj: any, args: IMutationCreateRoleArgs, context: any): Promise<IRole>  => {
                    return context.prisma.role.create({
                        data: {
                            name: args.name,
                        },
                    });
                },
                updateRole: (obj: any, args: IMutationUpdateRoleArgs, context: any): Promise<IRole>  => context.prisma.role.update({
                    where: {
                        id: args.id,
                    },
                    data: {
                        name: args.name,
                    },
                }),
                removeRole: (obj: any, args: IMutationRemoveRoleArgs, context: any): Promise<IRole>  => context.prisma.delete({
                    where: {
                        id: args.id,
                    },
                }),
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
