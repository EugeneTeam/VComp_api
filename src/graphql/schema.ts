import _ from 'lodash'
import {gql} from 'apollo-server-express';
import {makeExecutableSchema} from '@graphql-tools/schema';

import {prisma} from '../config/prismaClient';

import Role from './types/role';
import User from "./types/user";
import Callback from "./types/callback";
import Article from "./types/article";
import Favorite from "./types/favorite";
import PaymentType from "./types/paymentType";

import {getUserByToken} from "../typescript/user";
import {roleDirective, authDirective} from './directives';
import {GraphQLSchema} from "graphql/index";


export const typeDefs: any = gql`
    
	directive @hasRole(role: String) on FIELD_DEFINITION
	directive @auth on FIELD_DEFINITION
    
    ${User.typeDefs()}
    ${Role.typeDefs()}
    ${Callback.typeDefs()}
    ${Article.typeDefs()}
    ${Favorite.typeDefs()}
    ${PaymentType.typeDefs()}
    
	type Query {
		logIn(input: LogInInput): Token
        
		getRoles(limit: Int, offset: Int): [Role]                                                                       @auth @hasRole(role: "ADMIN")
		
		getArticle(id: Int!): Boolean
		getArticles(filter: ArticleFilter): ArticleResponse

		getPaymentTypes(limit: Int, offset: Int): [PaymentType]                                                         @auth @hasRole(role: "ADMIN")
		getPaymentType(id: Int!): PaymentType                                                                           @auth @hasRole(role: "ADMIN")
		getUsers(filter: UserInputFilter): UsersAndCount                                                                @auth @hasRole(role: "ADMIN")
		getUser(id: Int!): User                                                                                         @auth @hasRole(role: "ADMIN")
    }
    type Mutation {
		banUser(input: BanUserInput): User                                                                              @auth @hasRole(role: "ADMIN")
		unbanUser(input: UnbanUserInput): User                                                                          @auth @hasRole(role: "ADMIN")
        
		signIn(input: SignInInput): User
        
		createRole(name: String!): Role                                                                                 @auth @hasRole(role: "ADMIN")
		updateRole(id: Int!, name: String!): Role                                                                       @auth @hasRole(role: "ADMIN")
		removeRole(id: Int!): Role                                                                                      @auth @hasRole(role: "ADMIN")
		
        requestCallback(phone: String!): Boolean!                                                                       @auth @hasRole(role: "CUSTOMER")
        
		closeCallback(id: Int!): Boolean!                                                                               @auth @hasRole(role: "ADMIN")
        
		createArticle(input: ArticelInput!): Article!                                                                   @auth @hasRole(role: "GOVERNING_ARTICLES")
		updateArticle(input: ArticelInput!, id: Int!): Article                                                          @auth @hasRole(role: "GOVERNING_ARTICLES")
		removeArticle(id: Int!): Article                                                                                @auth @hasRole(role: "GOVERNING_ARTICLES")

		createUser(input: CreateUserInput!): User!                                                                      @auth @hasRole(role: "ADMIN")
		updateUser(input: UpdateUserInput): User!                                                                       @auth @hasRole(role: "ADMIN")

		addOrRemoveFavorite(input: FavoriteIpnut!): Favorite                                                             @auth @hasRole(role: "CUSTOMER")

		createPaymentType(input: PaymentTypeInput!): PaymentType                                                         @auth @hasRole(role: "ADMIN")
		removePaymentType(id: Int!): PaymentType                                                                        @auth @hasRole(role: "ADMIN")
		updatePaymentType(input: PaymentTypeInput!, id: Int!): PaymentType                                               @auth @hasRole(role: "ADMIN")
    }
`;

export const context: any = async (context: any) => {
    context.prisma = prisma;
    context.user = null;

    const token = context?.req?.headers?.authorization?.split(' ')
    if (token?.[1]) {
        context.user = await getUserByToken(token[1]);
    }

    return context;
};

export const combineResolvers: any = () => {
    return _.merge(
        User.resolver(),
        Role.resolver(),
		Callback.resolver(),
		Article.resolver(),
        Favorite.resolver(),
        PaymentType.resolver(),
    )
}

export let schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers: combineResolvers()
});


schema = roleDirective(schema);
schema = authDirective(schema);
