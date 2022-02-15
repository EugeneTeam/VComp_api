import faker from "faker";
import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import { getBearerToken } from "../token/generateToken";
import { EUsers } from "../constants";
import { prisma } from "../../config/prismaClient";
import { createDataForArticleCategory } from "../factories";
import {
    CREATE_ARTICLE_CATEGORY,
    UPDATE_ARTICLE_CATEGORY,
    REMOVE_ARTICLE_CATEGORY,
} from "../../graphql/mutations";
import {
    GET_ARTICLE_CATEGORY,
    GET_ARTICLE_CATEGORIES,
} from '../../graphql/queries';
import { getKeyValue } from "../../typescript/utils/helper";
import {
    ArticleCategory as IArticleCategory,
    ArticleCategoryInput as IArticleCategoryInput,
    ArticleCategoryQuantityAndList as IArticleCategoryQuantityAndList
} from "../../graphql";
import { getRandomEntry, compareObjects } from '../utils/helper';

const config: any = getConfig();

describe('Successful article category creation/update/deletion operations', function () {
    it('Successful creation of a new article', async function() {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const newInputData: IArticleCategoryInput = createDataForArticleCategory();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const newArticleCategory: { createArticleCategory: IArticleCategory } = await client.request(CREATE_ARTICLE_CATEGORY, {
            input: newInputData
        });

        compareObjects(newInputData, newArticleCategory.createArticleCategory);
    });

    it('Successful article category update', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const articleCategory: IArticleCategory = await getRandomEntry('articleCategory');
        const newInputData: IArticleCategoryInput = createDataForArticleCategory();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const updatedArticle: { updateArticleCategory: IArticleCategory } = await client.request(UPDATE_ARTICLE_CATEGORY, {
            input: newInputData,
            id: articleCategory!.id,
        });

        compareObjects(newInputData, updatedArticle.updateArticleCategory);
    });

    it('Successfully deleting an article category', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const articleCategories: any = await prisma.articleCategory.findMany({
            select: {
                id: true,
                name: true,
                parentId: true,
                // @ts-ignore
                articles: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        client.setHeader('Authorization', `Bearer ${ token }`);

        let articleCategory: IArticleCategory = articleCategories.find((item: any) => !item?.articles?.length);

        const removedArticle: { removeArticleCategory: IArticleCategory } = await client.request(REMOVE_ARTICLE_CATEGORY, {
            id: articleCategory?.id,
        });

        // @ts-ignore
        Object.keys(removedArticle.removeArticleCategory).forEach((field: string) => {
            expect(getKeyValue<string, any>(field)(removedArticle.removeArticleCategory))
                .toBe(getKeyValue<string, any>(field)(articleCategory));
        });
    });
})


describe('Successful get/receive (many) article categories', function() {
    it('Get article category by id', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const articleCategory: IArticleCategory = await getRandomEntry('articleCategory');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const findArticleCategory: { getArticleCategory: IArticleCategory } = await client.request(GET_ARTICLE_CATEGORY, {
            id: articleCategory?.id,
        });

        compareObjects(articleCategory, findArticleCategory.getArticleCategory);
    });

    it('Get a list of article categories', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const articleCategories: Array<IArticleCategory> = await prisma.articleCategory.findMany();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const listOfArticleCategories: { getArticleCategories: IArticleCategoryQuantityAndList } = await client.request(GET_ARTICLE_CATEGORIES);

        const index: number = faker.datatype.number({
            'min': 0,
            'max': articleCategories.length - 1
        });

        expect(listOfArticleCategories.getArticleCategories.count).toBe(articleCategories.length);

        Object.keys(articleCategories[index]).forEach((field: any) => {
            expect(getKeyValue<string, any>(field)(articleCategories[index]))
                .toBe(getKeyValue<string, any>(field)(listOfArticleCategories?.getArticleCategories?.rows?.[index]));
        });
    });
});

describe('Search article category by name', function() {
    it('Successful search for a category by title', async function() {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const articleCategory: IArticleCategory = await getRandomEntry('articleCategory');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const findArticleCategory: { getArticleCategories: IArticleCategoryQuantityAndList } = await client.request(GET_ARTICLE_CATEGORIES, {
            filter: {
                name: articleCategory?.name,
            },
        });

        expect(findArticleCategory).toHaveProperty('getArticleCategories');
        expect(findArticleCategory?.getArticleCategories).toHaveProperty('count');
        expect(findArticleCategory?.getArticleCategories).toHaveProperty('rows');
        expect(findArticleCategory?.getArticleCategories?.count).toBeGreaterThanOrEqual(1);
        expect(Array.isArray(findArticleCategory?.getArticleCategories?.rows)).toBe(true);
        expect(findArticleCategory?.getArticleCategories?.rows?.length).toBeGreaterThanOrEqual(1);
        // @ts-ignore
        Object.keys(findArticleCategory?.getArticleCategories?.rows[0]).forEach((field: string) => {
            expect(getKeyValue<string, any>(field)(findArticleCategory?.getArticleCategories?.rows?.[0]))
                .toBe(getKeyValue<string, any>(field)(articleCategory));
        })
    });
});
