import {gql} from 'apollo-server';

import {decryptPassword, encryptPassword, generateActivationToken, login, checkEmail} from '../../typescript/user';
import {getRoleIdByName} from "../../typescript/role";

export default class User {
    static resolver() {
        return {
            Query: {
                logIn: async (obj: any, args: {email: string, password: string, rememberMe: boolean}, context: any) => {
                    const user: any = await context.prisma.user.findUnique({
                        where: {
                            email: args.email,
                        },
                    });

                    if (!user) {
                        throw new Error('User not found');
                    }

                    const isPasswordValid: boolean = await decryptPassword(args.password, user.passwordHash);

                    if (!isPasswordValid) {
                        throw new Error('Wrong login or password');
                    }

                    return {
                        token: await login(args.rememberMe, user.passwordHash),
                    }
                }
            },
            Mutation: {
                signIn: async (obj: any, args: any, context: any) => {
                    if (args.input.password !== args.input.repeatPassword) {
                        throw new Error('Password mismatch');
                    }

                    await checkEmail(args?.input?.email);

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
                asd: User
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
        `;
    }
}
