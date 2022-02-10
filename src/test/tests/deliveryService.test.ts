import faker from "faker";
import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import {
    createDataForDeliveryService
} from '../factories';
import { EUsers } from '../constants';

import {
    CREATE_DELIVERY_SERVICE,
    UPDATE_DELIVERY_SERVICE,
    REMOVE_DELIVERY_SERVICE,
} from '../../graphql/mutations';
import {
    GET_DELIVERY_SERVICE,
    GET_DELIVERY_SERVICES,
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

        const newDeliveryService = await client.request(CREATE_DELIVERY_SERVICE, {
            input: newInputData
        });

        compareObjects(newInputData, newDeliveryService.createDeliveryService);
    });

    it('Successful service update', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const deliveryService = await getRandomEntry('deliveryService');
        const newInputData: any = createDataForDeliveryService();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const updatedDeliveryService = await client.request(UPDATE_DELIVERY_SERVICE, {
            input: newInputData,
            id: deliveryService?.id,
        });

        compareObjects(newInputData, updatedDeliveryService.updateDeliveryService);
    });

    it('Successfully deleting an service', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const deliveryService = await getRandomEntry('deliveryService');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const removedDeliveryService = await client.request(REMOVE_DELIVERY_SERVICE, {
            id: deliveryService?.id,
        });

        compareObjects(deliveryService, removedDeliveryService.removeDeliveryService);
    });
});

describe('Successful deliver service get/get(many) operations', function() {
    it('Get article by id', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const deliveryService = await getRandomEntry('deliveryService');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const findDeliveryService = await client.request(GET_DELIVERY_SERVICE, {
            id: deliveryService?.id,
        });

        compareObjects(deliveryService, findDeliveryService.getDeliveryService);
    });

    it('Get list of delivery service', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const deliveryServices: Array<any> = await prisma.deliveryService.findMany();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const listOfDeliveryServices = await client.request(GET_DELIVERY_SERVICES);

        const index: number = faker.datatype.number({
            'min': 0,
            'max': deliveryServices.length - 1,
        });

        Object.keys(deliveryServices[index]).forEach((field: string) => {
            expect(getKeyValue<string, any>(field)(deliveryServices[index]))
                .toBe(getKeyValue<string, any>(field)(listOfDeliveryServices?.getDeliveryServices?.[index]));
        });
    });
});

it('Return error "A service with this name has already been created"', async function () {
        try {
            const client: GraphQLClient = new GraphQLClient(config.url);
            const token: string = await getBearerToken(EUsers.ADMIN, client);
            const newInputData: any = createDataForDeliveryService();

            client.setHeader('Authorization', `Bearer ${ token }`);

            await client.request(CREATE_DELIVERY_SERVICE, {
                input: newInputData
            });
            await client.request(CREATE_DELIVERY_SERVICE, {
                input: newInputData
            });
        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('A service with this name has already been created');
            });
        }
    });
