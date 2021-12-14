import {gql} from 'apollo-server';

import {IUser} from '../../typescript/interfaces';

import {decryptPassword, encryptPassword, generateActivationToken, login} from '../../models/user';

export default class User {
    static resolver() {
        return {
            Query: {
                logIn: async (obj: any, args: {email: string, password: string, rememberMe: boolean}, context: any) => {
                    const user: IUser = await context.prisma.user.findUnique({
                        where: {
                            email: args.email
                        }
                    });

                    if (!user) {
                        throw new Error('User not found');
                    }

                    const isPasswordValid: boolean = await decryptPassword(args.password, user.passwordHash);

                    if (!isPasswordValid) {
                        throw new Error('Wrong login or password');
                    }

                    return {
                        token: await login(args.rememberMe, user.passwordHash)
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
                            email: args.input.email
                        }
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
                            // TODO set default role id
                            status: "INACTIVE",
                            roleId: 1,
                        }
                    });
                }
            }
        }
    }

    static typeDefs() {
        return gql`
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
