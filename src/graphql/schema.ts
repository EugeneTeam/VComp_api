import _ from 'lodash'
import {gql} from 'apollo-server-express';
import {makeExecutableSchema} from 'graphql-tools';

import Test from './types/test';
// import {Prisma} from '@prisma/client';

const typeDefs: any = gql`
    ${Test.typeDefs()}
	type Query {
		testQuery: TestRoute
    }
`

const combineResolvers: any = () => {
    return _.merge(
        Test.resolver()
    )
}

export const schema: any = makeExecutableSchema({
    typeDefs,
    resolvers: combineResolvers()
});

export const context: any = async (context: any) => {
    // context.prisma = Prisma;
    return context;
}
