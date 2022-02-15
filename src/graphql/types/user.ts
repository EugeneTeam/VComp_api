import { gql } from 'apollo-server';
import {
    decryptPassword,
    encryptPassword,
    generateActivationToken,
    login,
    checkEmail
} from '../../typescript/user';
import {
    User as TUser,
    QueryGetUserArgs as TQueryGetUserArgs,
    QueryGetUsersArgs as TQueryGetUsersArgs,
    UsersAndCount as TUsersAndCount,
    QueryLogInArgs as TQueryLogInArgs,
    Token as TToken,
    MutationUnbanUserArgs as TMutationUnbanUserArgs,
    MutationBanUserArgs as TMutationBanUserArgs,
    MutationSignInArgs as TMutationSignInArgs,
    MutationCreateUserArgs as TMutationCreateUserArgs,
    MutationUpdateUserArgs as TMutationUpdateUserArgs,
} from '../../graphql';
import { QueryUtil } from '../../typescript/utils/helper';
import { getRoleIdByName } from "../../typescript/role";

export default class User extends QueryUtil{
    static resolver(): any {
        this.init('user');
        return {
            Query: {
                getUser: async (obj: any, args: TQueryGetUserArgs): Promise<TUser> => {
                    return this.findById(args.id);
                },
                getUsers: async (obj: any, args: TQueryGetUsersArgs): Promise<TUsersAndCount> => {
                    const filter: any = {
                        where: {
                            ...(args?.filter?.fullName && { fullName: { contains: args.filter.fullName} }),
                            ...(args?.filter?.phone && { phone: { contains: args.filter.phone} }),
                            ...(args?.filter?.city && { city: { contains: args.filter.city } }),
                            ...(args?.filter?.email && { email: { contains: args.filter.email } }),
                            ...(args?.filter?.status && { status: args.filter.status }),
                            ...(args?.filter?.role && { roleId: await getRoleIdByName(args.filter.role) }),
                        },
                    };
                    return this.findAllAndCount(filter, args?.filter?.limit, args?.filter?.offset);
                },
                logIn: async (obj: any, args: TQueryLogInArgs, context: any): Promise<TToken> => {
                    const user: any = await context.prisma.user.findUnique({
                        where: {
                            email: args.input!.email,
                        },
                    });

                    if (!user) {
                        throw new Error('User not found');
                    }

                    const isPasswordValid: boolean = await decryptPassword(args.input!.password, user.passwordHash);

                    if (!isPasswordValid) {
                        throw new Error('Wrong login or password');
                    }

                    return {
                        token: await login(!!args.input!.rememberMe, user.passwordHash),
                    }
                }
            },
            Mutation: {
                unbanUser: async (obj: any, args: TMutationUnbanUserArgs, context: any): Promise<TUser> => {
                    const user: TUser | null = await context.prisma.user.findUnique({
                        where: {
                            id: args.input!.userId,
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
                            id: args.input!.userId,
                        },
                        data: {
                            status: args.input!.userStatus,
                            banReason: null,
                        },
                    });
                },
                banUser: async (obj: any, args: TMutationBanUserArgs, context: any): Promise<TUser> => {
                    const user: TUser | null = await context.prisma.user.findUnique({
                        where: {
                            id: args.input!.userId,
                        },
                    });

                    if (!user) {
                        throw new Error('User not found');
                    }

                    return context.prisma.user.update({
                        where: {
                            id: args.input!.userId,
                        },
                        data: {
                            status: 'BANNED',
                            banReason: args.input!.banReason,
                        },
                    });
                },
                signIn: async (obj: any, args: TMutationSignInArgs, context: any): Promise<TUser> => {
                    if (args.input!.password !== args.input!.repeatPassword) {
                        throw new Error('Password mismatch');
                    }

                    await checkEmail(args.input!.email);

                    return context.prisma.user.create({
                        data: {
                            fullName: args.input!.fullName,
                            phone: args.input!.phone,
                            city: args.input!.city,
                            email: args.input!.email,
                            activationToken: generateActivationToken(),
                            passwordHash: await encryptPassword(args.input!.password),
                            status: "INACTIVE",
                            roleId: await getRoleIdByName('CUSTOMER'),
                        },
                    });
                },
                createUser: async (obj: any, args: TMutationCreateUserArgs, context: any): Promise<TUser> => {
                     return context.prisma.user.create({
                         data: {
                             fullName: args.input.fullName,
                             phone: args.input.phone,
                             city: args.input.city,
                             email: args.input.email,
                             activationToken: generateActivationToken(),
                             passwordHash: await encryptPassword(args.input.password),
                             status: args.input.status,
                             roleId: await getRoleIdByName(args.input.role),
                         },
                     });
                },
                updateUser: async (obj: any, args: TMutationUpdateUserArgs, context: any): Promise<TUser> => {
                    const user = context.prisma.user.findUnique({
                        where: {
                            id: args.input!.id,
                        },
                    });

                    if (!user) {
                        throw new Error('User not found');
                    }

                    await checkEmail(args.input!.email || '');

                    return context.prisma.user.update({
                        where: {
                            id: args.input!.id,
                        },
                        data: {
                            ...(args?.input?.fullName && { fullName: args.input.fullName }),
                            ...(args?.input?.phone && { phone: args.input.phone }),
                            ...(args?.input?.city && { city: args.input.city }),
                            ...(args?.input?.email && { email: args.input.email }),
                            ...(args?.input?.activationToken && { activationToken: args.input.activationToken }),
                            ...(args?.input?.passwordHash && { passwordHash: args.input.passwordHash }),
                            ...(args?.input?.status && { status: args.input.status }),
                            ...(args?.input?.role && { roleId: args.input.role }),
                        },
                    });
                }
            }
        }
    }

    static typeDefs(): object {
        return gql`
            
            # ENUMS
            
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
            
            # TYPES
            
			type Token {
				token: String
			}
            
			type UsersAndCount {
				count: Int!
				rows: [User]
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
            
            # INPUTS
            
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
				activationToken: String = null
				passwordHash: String = null
            }

            input UserInputFilter {
				fullName: String
				phone: String
				city: String
				email: String
				status: UserStatus
				role: UserRole
                limit: Int
                offset: Int
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
