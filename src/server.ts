import dotEnv from 'dotenv';
dotEnv.config();

import {ApolloServer} from "apollo-server";
import {applyMiddleware} from 'graphql-middleware';

import {context, schema} from "./graphql/schema";

export const server = new ApolloServer({
    formatError: error => {
        if (process.env.NODE_ENV === 'development') {
            console.log('-------------------------------------------------------------------------------------------------');
            console.log(error);
        }
        return error;
    },
    schema: applyMiddleware(schema),
    context,
});
