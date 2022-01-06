import {gql} from 'apollo-server';

import {decryptPassword, encryptPassword, generateActivationToken, login} from '../../typescript/user';
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

                    const checkEmail = await context.prisma.user.findUnique({
                        where: {
                            email: args.input.email,
                        },
                    });

                    if (checkEmail) {
                        throw new Error('Email is used');
                    }

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
