import {ApolloServer} from "apollo-server";
import {applyMiddleware} from 'graphql-middleware';

import {context, schema} from "./graphql/schema";

export const server = new ApolloServer({
    formatError: error => {
        console.log('-------------------------------------------------------------------------------------------------');
        console.log(error);
        return error;
    },
    schema: applyMiddleware(schema),
    context,
});
