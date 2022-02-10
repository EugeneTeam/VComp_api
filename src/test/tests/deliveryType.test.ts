import faker from "faker";
import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import {
    createDataForDeliveryService
} from '../factories';
import { EUsers } from '../constants';

import {
    CREATE_DELIVERY_TYPE,
    UPDATE_DELIVERY_TYPE,
    REMOVE_DELIVERY_TYPE,
} from '../../graphql/mutations';
import {
    GET_DELIVERY_TYPE,
    GET_DELIVERY_TYPES,
} from '../../graphql/queries';
import { getBearerToken } from '../token/generateToken'
import { getKeyValue } from '../../typescript/utils/helper';
import { getRandomEntry, compareObjects } from '../utils/helper';
import { prisma } from "../../config/prismaClient";

const config: any = getConfig();

describe('Successful delivery service creation/update/deletion operations', function() {
    it('Successful creation of a new delivery service', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const newInputData: any = createDataForDeliveryService();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const newDeliveryType = await client.request(CREATE_DELIVERY_TYPE, {
            input: newInputData
        });

        compareObjects(newInputData, newDeliveryType.createDeliveryType);
    });

    it('Successful service update', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const deliveryType = await getRandomEntry('deliveryType');
        const newInputData: any = createDataForDeliveryService();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const updatedDeliveryType = await client.request(UPDATE_DELIVERY_TYPE, {
            input: newInputData,
            id: deliveryType?.id,
        });

        compareObjects(newInputData, updatedDeliveryType.updateDeliveryType);
    });

    it('Successfully deleting an service', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const deliveryType = await getRandomEntry('deliveryType');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const removedDeliveryType = await client.request(REMOVE_DELIVERY_TYPE, {
            id: deliveryType?.id,
        });

        compareObjects(deliveryType, removedDeliveryType.removeDeliveryType);
    });
});

describe('Successful deliver service get/get(many) operations', function() {
    it('Get article by id', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const deliveryType = await getRandomEntry('deliveryType');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const findDeliveryType = await client.request(GET_DELIVERY_TYPE, {
            id: deliveryType?.id,
        });

        compareObjects(deliveryType, findDeliveryType.getDeliveryType);
    });

    it('Get list of delivery service', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const deliveryTypes: Array<any> = await prisma.deliveryType.findMany();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const listOfDeliveryTypes = await client.request(GET_DELIVERY_TYPES);

        const index: number = faker.datatype.number({
            'min': 0,
            'max': deliveryTypes.length - 1,
        });

        Object.keys(deliveryTypes[index]).forEach((field: string) => {
            expect(getKeyValue<string, any>(field)(deliveryTypes[index]))
                .toBe(getKeyValue<string, any>(field)(listOfDeliveryTypes?.getDeliveryTypes?.[index]));
        });
    });
});

it('Return error "A service with this name has already been created"', async function () {
        try {
            const client: GraphQLClient = new GraphQLClient(config.url);
            const token: string = await getBearerToken(EUsers.ADMIN, client);
            const newInputData: any = createDataForDeliveryService();

            client.setHeader('Authorization', `Bearer ${ token }`);

            await client.request(CREATE_DELIVERY_TYPE, {
                input: newInputData
            });
            await client.request(CREATE_DELIVERY_TYPE, {
                input: newInputData
            });
        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('A delivery type with this name has already been created');
            });
        }
    });
