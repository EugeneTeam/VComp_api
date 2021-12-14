import _ from 'lodash'
import {gql} from 'apollo-server-express';
import {makeExecutableSchema} from 'graphql-tools';

import {PrismaClient} from '@prisma/client';

import Role from './types/role';
import User from "./types/user";

import {getUserByToken} from "../models/user";
import {roleDirective, authDirective} from './directives';
import {GraphQLSchema} from "graphql/index";

const prisma: PrismaClient = new PrismaClient()

const typeDefs: any = gql`
    
	directive @hasRole(role: String) on FIELD_DEFINITION
	directive @auth on FIELD_DEFINITION
    
	enum UserStatus {
		ACTIVE
		INACTIVE
		BANNED
	}

	enum UserRole {
		ADMIN
		MANAGER
		CUSTOMER
		GOVERNING_ARTICLES
		BANNER_MANAGER
	}
    
    ${User.typeDefs()}
    ${Role.typeDefs()}
    
	type Query {
		getRoles(limit: Int, offset: Int): [Role] @auth @hasRole(role: "ADMIN")
		logIn(email: String!, password: String!, rememberMe: Boolean = false): Token
		
    }
    type Mutation {
		createRole(name: String!): Role @auth @hasRole(role: "ADMIN")
		signIn(input: SignInInput): User 
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

const combineResolvers: any = () => {
    return _.merge(
        User.resolver(),
        Role.resolver()
    )
}

export let schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers: combineResolvers()
});

schema = roleDirective(schema);
schema = authDirective(schema);
