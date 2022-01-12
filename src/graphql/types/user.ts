import {gql} from 'apollo-server';

import {decryptPassword, encryptPassword, generateActivationToken, login, checkEmail} from '../../typescript/user';
import {getRoleIdByName} from "../../typescript/role";
import {User as IUser} from '../../graphql';

export default class User {
    static resolver() {
        return {
            Query: {
                getUser: async (obj: any, args: any, context: any) => {
                  const user: IUser | null = await context.prisma.user.findUnique({
                      where: {
                          id: args.id,
                      },
                  });
                  if (!user) {
                      throw new Error('User not found');
                  }
                  return user;
                },
                getUsers: async (obj: any, args: any, context: any) => {
                    const pagination = {
                        ...(args?.filter?.limit ? {take: args.filter.limit} : null),
                        ...(args?.filter?.offset ? {skip: args.filter.offset} : null),
                    };
                    const filter = {
                        where: {
                            ...(args?.filter?.fullName ? {fullName: {contains: args.filter.fullName}} : null),
                            ...(args?.filter?.phone ? {phone: {contains: args.filter.phone}} : null),
                            ...(args?.filter?.city ? {city: {contains: args.filter.city}} : null),
                            ...(args?.filter?.email ? {email: {contains: args.filter.email}} : null),
                            ...(args?.filter?.status ? {status: args.filter.status} : null),
                            ...(args?.filter?.role ? {roleId: await getRoleIdByName(args.filter.role)} : null),
                        },
                    };
                    if (args?.filter?.createdAtFrom || args?.filter?.createdAtTo) {
                        // @ts-ignore
                        filter.where.createdAt = {
                            gte: new Date(args.filter.createdAtFrom),
                            lt: new Date(args.filter.createdAtFrom),
                        }
                    }
                    const count = await context.prisma.user.aggregate({
                        _count: {
                            id: true,
                        },
                        ...filter,
                    });

                    const users = await context.prisma.user.findMany({
                        ...pagination,
                        ...filter,
                    });

                    console.log(filter)
                    return {
                        count: count?._count.id,
                        rows: users,
                    }
                },
                logIn: async (obj: any, args: any, context: any) => {
                    const user: any = await context.prisma.user.findUnique({
                        where: {
                            email: args.input.email,
                        },
                    });

                    if (!user) {
                        throw new Error('User not found');
                    }

                    const isPasswordValid: boolean = await decryptPassword(args.input.password, user.passwordHash);

                    if (!isPasswordValid) {
                        throw new Error('Wrong login or password');
                    }

                    return {
                        token: await login(args.input.rememberMe, user.passwordHash),
                    }
                }
            },
            Mutation: {
                unbanUser: async (obj: any, args: any, context: any) => {
                    const user = await context.prisma.user.findUnique({
                        where: {
                            id: args.input.userId,
                        },
                    });

                    if (!user) {
                        throw new Error('User not found');
                    }

                    if (args?.input?.userStatus === 'BANNED') {
                        throw new Error('Invalid status for this operation');
                    }

                    return context.prisma.user.update({
                        where: {
                            id: args.input.userId,
                        },
                        data: {
                            status: args.input.userStatus,
                            banReason: null,
                        },
                    });
                },
                banUser: async (obj: any, args: any, context: any) => {
                    const user = await context.prisma.user.findUnique({
                        where: {
                            id: args.input.userId,
                        },
                    });

                    if (!user) {
                        throw new Error('User not found');
                    }

                    return context.prisma.user.update({
                        where: {
                            id: args.input.userId,
                        },
                        data: {
                            status: 'BANNED',
                            banReason: args.input.banReason,
                        },
                    });
                },
                signIn: async (obj: any, args: any, context: any) => {
                    if (args.input.password !== args.input.repeatPassword) {
                        throw new Error('Password mismatch');
                    }

                    await checkEmail(args.input.email);

                    return context.prisma.user.create({
                        data: {
                            fullName: args.input.fullName,
                            phone: args.input.phone,
                            city: args.input.city,
                            email: args.input.email,
                            activationToken: generateActivationToken(),
                            passwordHash: await encryptPassword(args.input.password),
                            status: "INACTIVE",
                            roleId: await getRoleIdByName('CUSTOMER'),
                        },
                    });
                },
                createUser: async (obj: any, args: any, context: any) => {
                     return context.prisma.user.create({
                         data: {
                             fullName: args.input.fullName,
                             phone: args.input.phone,
                             city: args.input.city,
                             email: args.input.email,
                             activationToken: generateActivationToken(),
                             passwordHash: await encryptPassword(args.input.password),
                             status: args.input.status,
                             roleId: await getRoleIdByName(args.input.role)
                         },
                     });
                },
                updateUser: async (obj: any, args: any, context: any) => {
                    const user = context.prisma.user.findUnique({
                        where: {
                            id: args.input.id,
                        },
                    });

                    if (!user) {
                        throw new Error('User not found');
                    }

                    await checkEmail(args?.input?.email);

                    return context.prisma.user.update({
                        where: {
                            id: args.input.id,
                        },
                        data: {
                            ...(args?.input?.fullName ? {fullName: args.input.fullName} : null),
                            ...(args?.input?.phone ? {phone: args.input.phone} : null),
                            ...(args?.input?.city ? {city: args.input.city} : null),
                            ...(args?.input?.email ? {email: args.input.email} : null),
                            ...(args?.input?.activationToken ? {activationToken: args.input.activationToken} : null),
                            ...(args?.input?.passwordHash ? {passwordHash: args.input.passwordHash} : null),
                            ...(args?.input?.status ? {status: args.input.status} : null),
                            ...(args?.input?.roleId ? {roleId: args.input.roleId} : null),
                        },
                    });
                }
            }
        }
    }

    static typeDefs() {
        return gql`
			enum UserRole {
				ADMIN
				MANAGER
				CUSTOMER
				GOVERNING_ARTICLES
				BANNER_MANAGER
			}

			enum UserStatus {
				ACTIVE
				INACTIVE
				BANNED
			}
            
            input SignInInput {
				fullName: String!
				phone: String!
				city: String!
				email: String!
                password: String!
                repeatPassword: String!
            }
            
            input LogInInput {
				email: String!
                password: String!
                rememberMe: Boolean! = false
            }
            
            input CreateUserInput {
				fullName: String!
				phone: String!
				city: String!
				email: String!
				password: String!
				status: UserStatus!
				role: UserRole!
            }
            
            input UpdateUserInput {
                id: Int!
				fullName: String = null
				phone: String = null
				city: String = null
				email: String = null
				password: String = null
				status: UserStatus = null
				role: UserRole = null
            }
            
            type Token {
                token: String!
            }
            
            type User {
				id: Int!
				fullName: String!
				phone: String!
				city: String!
				email: String!
				status: UserStatus
				banReason: String
				activationToken: String
				passwordHash: String
				resetPasswordToken: String
				googleId: String
				roleId: Int
            }
            
            input UserInputFilter {
				fullName: String
				phone: String
				city: String
				email: String
				status: UserStatus
				role: UserRole
				createdAtFrom: String
				createdAtTo: String
                limit: Int
                offset: Int
            }
            
            type UsersAndCount {
                count: Int!
                rows: [User]
            }
            
            input UnbanUserInput {
                userId: Int!
                userStatus: UserStatus!
            }

			input BanUserInput {
				userId: Int!
				banReason: String!
			}
        `;
    }
}
