import faker from "faker";
import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import {
    createDataForDiscount
} from '../factories';
import { EUsers } from '../constants';

import {
    ADD_DISCOUNT,
    UPDATE_DISCOUNT,
    REMOVE_DISCOUNT,
} from '../../graphql/mutations';
import {
    GET_DISCOUNT,
    GET_DISCOUNTS,
} from '../../graphql/queries';
import { getBearerToken } from '../token/generateToken'
import { getKeyValue } from '../../typescript/utils/helper';
import {getRandomEntry, compareObjects, createDate} from '../utils/helper';
import { prisma } from "../../config/prismaClient";

const config: any = getConfig();

describe('Successful discount creation/update/deletion operations', function() {
    it('Successful creation of a new discount', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const newInputData: any = createDataForDiscount();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const newDiscount = await client.request(ADD_DISCOUNT, {
            input: newInputData,
        });

        compareObjects(newInputData, newDiscount.addDiscount, 'expiredAt');
    });

    it('Successful discount update', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const discount: any = await getRandomEntry('discount');
        const newInputData: any = createDataForDiscount();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const updatedDiscount = await client.request(UPDATE_DISCOUNT, {
            input: newInputData,
            id: discount?.id,
        });

        compareObjects(newInputData, updatedDiscount.updateDiscount, 'expiredAt');
    });

    it('Successfully deleting an article', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const discount = await getRandomEntry('discount');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const removedDiscount = await client.request(REMOVE_DISCOUNT, {
            id: discount?.id,
        });

        compareObjects(discount, removedDiscount.removeDiscount, 'expiredAt');
    });
});

describe('Successful discount get/get(many) operations', function() {
    it('Get discount by id', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const discount = await getRandomEntry('discount');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const findDiscount = await client.request(GET_DISCOUNT, {
            id: discount?.id,
        });

        compareObjects(discount, findDiscount.getDiscount, 'expiredAt');
    });

    it('Get list of discounts', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const discounts: Array<any> = await prisma.discount.findMany();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const listOfDiscounts = await client.request(GET_DISCOUNTS);

        const index: number = faker.datatype.number({
            'min': 0,
            'max': discounts.length - 1,
        });

        expect(listOfDiscounts.getDiscounts.count).toBe(discounts.length);
        // @ts-ignore
        Object.keys(discounts[index]).forEach((field: string) => {
            let arg1 = getKeyValue<string, any>(field)(discounts[index]);
            let arg2 = getKeyValue<string, any>(field)(listOfDiscounts?.getDiscounts?.rows?.[index]);
            if (field === 'expiredAt') {
                arg1 = new Date(createDate(arg1.toString())).toUTCString();
                arg2 = new Date(createDate(arg1.toString())).toUTCString();
            }
            expect(arg1).toBe(arg2);
        });
    });
});
