import _ from 'lodash'
import {gql} from 'apollo-server-express';
import {makeExecutableSchema} from 'graphql-tools';

import {PrismaClient} from '@prisma/client';


import Test from './types/test';
import Role from './types/role';

const prisma: PrismaClient = new PrismaClient()


const typeDefs: any = gql`
    ${Test.typeDefs()}
    ${Role.typeDefs()}
	type Query {
		testQuery: TestRoute
		getRoles(limit: Int, offset: Int): [Role]
    }
    type Mutation {
		createRole(name: String!): Role
    }
`

const combineResolvers: any = () => {
    return _.merge(
        Test.resolver(),
        Role.resolver()
    )
}

export const schema: any = makeExecutableSchema({
    typeDefs,
    resolvers: combineResolvers()
});



export const context: any = async (context: any) => {
    context.prisma = prisma;
    return context;

}
