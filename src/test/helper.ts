import dotEnv from 'dotenv';
dotEnv.config();

import { server } from '../server';
import { PrismaClient } from '@prisma/client';
import { Headers } from 'cross-fetch';

// @ts-ignore
global.Headers = global.Headers || Headers;

type Config = {url: string}

export const getConfig = () => {
    const prisma = new PrismaClient();

    let config: any = {};

    beforeAll(async () => {
        const {url} = await server.listen({port: 0});
        config.url = url;
        return config;
    });

    afterAll(async () => {
        await server.stop();
        return prisma.$disconnect();
    })

    return config as Config;
}
