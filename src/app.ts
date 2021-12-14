import dotEnv from 'dotenv';
dotEnv.config();

import express, {Application} from 'express';
import {PrismaClient} from '@prisma/client';
import bodyParser from 'body-parser';
import {ApolloServer} from "apollo-server-express";

import {context, schema} from './graphql/schema';

(async () => {
    // RUN EXPRESS
    const app: Application = express();

    // RUN PRISMA
    const prisma = new PrismaClient();

    // RUN GRAPHQL
    const server = new ApolloServer({
        formatError: error => {
            console.log('-----------------------------------------------------------------------------------------------')
            console.log(error)
            return error
        },
        schema,
        context
    });

    await server.start();

    // ADDED GRAPHQL TO EXPRESS
    server.applyMiddleware({app});

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.listen(4000, () => {
        console.log('SERVER START')
    })
})()
