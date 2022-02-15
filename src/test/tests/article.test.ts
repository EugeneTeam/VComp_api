import faker from "faker";
import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import {
    createDataForArticle
} from '../factories';
import { EUsers } from '../constants';
import {
    Article as IArticle,
    ArticleCategory as IArticleCategory,
    ArticleCategoryQuantityAndList as IArticleCategoryQuantityAndList,
} from '../../graphql';
import {
    CREATE_ARTICLE,
    UPDATE_ARTICLE,
    REMOVE_ARTICLE,
} from '../../graphql/mutations';
import {
    GET_ARTICLE,
    GET_ARTICLES,
} from '../../graphql/queries';
import { getBearerToken } from '../token/generateToken'
import { getKeyValue } from '../../typescript/utils/helper';
import { getRandomEntry, compareObjects } from '../utils/helper';
import { prisma } from "../../config/prismaClient";

const config: any = getConfig();

describe('Successful article creation/update/deletion operations', function() {
    it('Successful creation of a new article', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const category: IArticleCategory = await getRandomEntry('articleCategory');
        const newInputData: any = createDataForArticle(category!.id);

        client.setHeader('Authorization', `Bearer ${ token }`);

        const newArticle: { createArticle: IArticle } = await client.request(CREATE_ARTICLE, {
            input: newInputData
        });

        compareObjects(newInputData, newArticle.createArticle);
    });

    it('Successful article update', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const category: IArticleCategory = await getRandomEntry('articleCategory');
        const article: IArticle = await getRandomEntry('article');
        const newInputData: any = createDataForArticle(category?.id);

        client.setHeader('Authorization', `Bearer ${ token }`);

        const updatedArticle: { updateArticle: IArticle } = await client.request(UPDATE_ARTICLE, {
            input: newInputData,
            id: article?.id,
        });

        compareObjects(newInputData, updatedArticle.updateArticle);
    });

    it('Successfully deleting an article', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const article: IArticle = await getRandomEntry('article');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const removedArticle: { removeArticle: IArticle } = await client.request(REMOVE_ARTICLE, {
            id: article!.id,
        });

        compareObjects(article, removedArticle.removeArticle);
    });
});

describe('Successful article get/get(many) operations', function() {
    it('Get article by id', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const article: IArticle = await getRandomEntry('article');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const findArticle: { getArticle: IArticle } = await client.request(GET_ARTICLE, {
            id: article!.id,
        });

        compareObjects(article, findArticle.getArticle);
    });

    it('Get list of articles', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const articles: Array<any> = await prisma.article.findMany();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const listOfArticles: { getArticles: IArticleCategoryQuantityAndList } = await client.request(GET_ARTICLES);

        const index: number = faker.datatype.number({
            'min': 0,
            'max': articles.length - 1,
        });

        expect(listOfArticles.getArticles.count).toBe(articles.length);
        // @ts-ignore
        Object.keys(articles[index]).forEach((field: string) => {
            expect(getKeyValue<string, any>(field)(articles[index]))
                .toBe(getKeyValue<string, any>(field)(listOfArticles?.getArticles?.rows?.[index]));
        });
    });
});

describe('Return error "Access Denied"', function() {
    it('Creating an article without permission will return an error', async function () {
        try {
            const client: GraphQLClient = new GraphQLClient(config.url);
            const token: string = await getBearerToken(EUsers.CUSTOMER, client);
            const category: IArticleCategory = await getRandomEntry('articleCategory');
            const newInputData: any = createDataForArticle(category!.id);

            client.setHeader('Authorization', `Bearer ${ token }`);

            await client.request(CREATE_ARTICLE, {
                input: newInputData,
            });

        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Access denied');
            });
        }
    });

    it('Updating an article without permission will return an error', async function () {
        try {
            const client: GraphQLClient = new GraphQLClient(config.url);
            const token: string = await getBearerToken(EUsers.CUSTOMER, client);
            const articleCategory: IArticleCategory = await getRandomEntry('articleCategory');
            const article: IArticle = await getRandomEntry('article');
            const newInputData: any = createDataForArticle(articleCategory?.id);

            client.setHeader('Authorization', `Bearer ${ token }`);

            await client.request(UPDATE_ARTICLE, {
                input: newInputData,
                id: article!.id,
            });
        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Access denied');
            });
        }
    });

    it('Deleting an article without permission will return an error', async function () {
        try {
            const client: GraphQLClient = new GraphQLClient(config.url);
            const token: string = await getBearerToken(EUsers.CUSTOMER, client);
            const article: IArticle = await getRandomEntry('article');

            client.setHeader('Authorization', `Bearer ${ token }`);

            await client.request(REMOVE_ARTICLE, {
                id: article!.id,
            });
        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Access denied');
            });
        }
    });
});

