import _ from 'lodash'
import {gql} from 'apollo-server-express';
import {makeExecutableSchema} from '@graphql-tools/schema';

import {PrismaClient} from '@prisma/client';

import Role from './types/role';
import User from "./types/user";
import Callback from "./types/callback";
import Article from "./types/article";
import Favorite from "./types/favorite";

import {getUserByToken} from "../typescript/user";
import {roleDirective, authDirective} from './directives';
import {GraphQLSchema} from "graphql/index";

const prisma: PrismaClient = new PrismaClient()

export const typeDefs: any = gql`
    
	directive @hasRole(role: String) on FIELD_DEFINITION
	directive @auth on FIELD_DEFINITION
    
    ${User.typeDefs()}
    ${Role.typeDefs()}
    ${Callback.typeDefs()}
    ${Article.typeDefs()}
    ${Favorite.typeDefs()}
    
	type Query {
		logIn(email: String!, password: String!, rememberMe: Boolean = false): Token
        
		getRoles(limit: Int, offset: Int): [Role]                                                                       @auth @hasRole(role: "ADMIN")
		
		getArticle(id: Int!): Boolean
		getArticles(filter: ArticleFilter): ArticleResponse
		
    }
    type Mutation {
		signIn(input: SignInInput): User
        
		createRole(name: String!): Role                                                                                 @auth @hasRole(role: "ADMIN")
		updateRole(id: Int!, name: String!): Role                                                                       @auth @hasRole(role: "ADMIN")
		removeRole(id: Int!): Role                                                                                      @auth @hasRole(role: "ADMIN")
		
        requestCallback(phone: String!): Boolean!                                                                       @auth @hasRole(role: "CUSTOMER")
        
		closeCallback(id: Int!): Boolean!                                                                               @auth @hasRole(role: "ADMIN")
        
		createArticle(input: ArticelInput!): Article!                                                                   @auth @hasRole(role: "GOVERNING_ARTICLES")
		updateArticle(input: ArticelInput!, articleId: ArticleId!): Article                                             @auth @hasRole(role: "GOVERNING_ARTICLES")
		removeArticle(articleId: ArticleId!): Article                                                                   @auth @hasRole(role: "GOVERNING_ARTICLES")

		createUser(input: CreateUserInput!): User!                                                                      @auth @hasRole(role: "ADMIN")
		updateUser(input: UpdateUserInput): User!                                                                       @auth @hasRole(role: "ADMIN")

		addOrRemoveFavorite(input: FavoriteIpnut): Favorite                                                             @auth @hasRole(role: "CUSTOMER")
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
    )
}

export let schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers: combineResolvers()
});


schema = roleDirective(schema);
schema = authDirective(schema);
