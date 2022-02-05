import faker from "faker";
import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import {
    createDataForCategory
} from '../factories';
import { EUsers } from '../constants';
import {
    Article as IArticle,
    ArticleCategoryQuantityAndList as IArticleCategoryQuantityAndList
} from '../../graphql';
import {
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    REMOVE_CATEGORY,
} from '../../graphql/mutations';
import {
    GET_CATEGORY,
    GET_CATEGORIES,
} from '../../graphql/queries';
import { getBearerToken } from '../token/generateToken'
import { getKeyValue } from '../../typescript/utils/helper';
import { getRandomEntry, compareObjects } from '../utils/helper';
import { prisma } from "../../config/prismaClient";

const config: any = getConfig();

describe('Successful category creation/update/deletion operations', function() {
    it('Successful creation of a new category', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);

        const newInputData = createDataForCategory();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const newCategory = await client.request(CREATE_CATEGORY, {
            input: newInputData
        });

        compareObjects(newInputData, newCategory.createCategory);
    });

    it('Successful creation of a new subcategory', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);

        const category = await getRandomEntry('category');
        const newInputData = createDataForCategory(category?.id);

        client.setHeader('Authorization', `Bearer ${ token }`);

        const newCategory = await client.request(CREATE_CATEGORY, {
            input: newInputData
        });

        compareObjects(newInputData, newCategory.createCategory);
    });

    it('Successful category update', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);
        const category = await getRandomEntry('category');

        const newInputData = createDataForCategory();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const updatedCategory = await client.request(UPDATE_CATEGORY, {
            input: newInputData,
            id: category?.id,
        });

        compareObjects(newInputData, updatedCategory.updateCategory);
    });

    it('Successfully deleting a category', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);
        const category = await getRandomEntry('category');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const removedCategory = await client.request(REMOVE_CATEGORY, {
            id: category?.id,
        });

        compareObjects(category, removedCategory.removeCategory);
    });
});

it('Return error "A category with this name has already been created"', async function () {
    try {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);

        const newInputData = createDataForCategory();

        client.setHeader('Authorization', `Bearer ${ token }`);

        await client.request(CREATE_CATEGORY, {
            input: newInputData
        });
        await client.request(CREATE_CATEGORY, {
            input: newInputData
        });
    } catch (e: any) {
        expect(e.response.errors.length).toBeTruthy();
        e.response.errors.some((error: any) => {
            return expect(error.message).toEqual('A category with this name has already been created');
        });
    }
});

describe('Successful category get/get(many) operations', function() {
    it('Get category by id', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);
        const category = await getRandomEntry('category');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const findCategory = await client.request(GET_CATEGORY, {
            id: category?.id,
        });

        compareObjects(category, findCategory.getCategory);
    });

    it('Get list of category', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);
        const categories = await prisma.category.findMany();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const listOfCategories = await client.request(GET_CATEGORIES);

        const index = faker.datatype.number({
            'min': 0,
            'max': categories.length - 1,
        });

        expect(listOfCategories.getCategories.count).toBe(categories.length);
        // @ts-ignore
        Object.keys(categories[index]).forEach((field: any) => {
            expect(getKeyValue<string, any>(field)(categories[index]))
                .toBe(getKeyValue<string, any>(field)(listOfCategories?.getCategories?.rows?.[index]));
        });
    });
});
