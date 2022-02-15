import {gql} from 'apollo-server-express';
import {
    Role as TRole,
    QueryGetRolesArgs as TQueryGetRolesArgs,
    MutationCreateRoleArgs as TMutationCreateRoleArgs,
    MutationRemoveRoleArgs as TMutationRemoveRoleArgs,
    MutationUpdateRoleArgs as TMutationUpdateRoleArgs,
} from '../../graphql';

export default class Role {
    static resolver(): any {
        return {
            Query: {
                getRoles: async (obj: any, { limit, offset }: TQueryGetRolesArgs, context: any): Promise<Array<TRole>> => {
                    return context.prisma.role.findMany({
                        ...(limit && { take: limit }),
                        ...(offset && { skip: offset }),
                    });
                }
            },
            Mutation: {
                createRole: (obj: any, args: TMutationCreateRoleArgs, context: any): Promise<TRole>  => {
                    return context.prisma.role.create({
                        data: {
                            name: args.name,
                        },
                    });
                },
                updateRole: (obj: any, args: TMutationUpdateRoleArgs, context: any): Promise<TRole>  => {
                    return context.prisma.role.update({
                        where: {
                            id: args.id,
                        },
                        data: {
                            name: args.name,
                        },
                    });
                },
                removeRole: (obj: any, args: TMutationRemoveRoleArgs, context: any): Promise<TRole>  => {
                    return context.prisma.delete({
                        where: {
                            id: args.id,
                        },
                    });
                },
            }
        }
    }

    static typeDefs(): object {
        return gql`
            type Role {
                id: Int!
                name: String!
            }
        `;
    }
}
