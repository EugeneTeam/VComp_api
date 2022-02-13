import faker from "faker";
import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import {
    createDataForDeliveryService
} from '../factories';
import { EUsers } from '../constants';
import {
    CREATE_PAYMENT_TYPE,
    UPDATE_PAYMENT_TYPE,
    REMOVE_PAYMENT_TYPE,
} from '../../graphql/mutations';
import {
    GET_PAYMENT_TYPE,
    GET_PAYMENT_TYPES,
} from '../../graphql/queries';
import { getBearerToken } from '../token/generateToken'
import { getKeyValue } from '../../typescript/utils/helper';
import { getRandomEntry, compareObjects } from '../utils/helper';
import { prisma } from "../../config/prismaClient";
import paymentType from "../../graphql/types/paymentType";

const config: any = getConfig();

describe('Successful payment type creation/update/deletion operations', function() {
    it('Successful creation of a new payment type', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const newInputData: any = createDataForDeliveryService();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const newPaymentType = await client.request(CREATE_PAYMENT_TYPE, {
            input: newInputData
        });

        compareObjects(newInputData, newPaymentType.createPaymentType);
    });

    it('Successful service update', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const paymentType = await getRandomEntry('paymentType');
        const newInputData: any = createDataForDeliveryService();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const updatedDeliveryType = await client.request(UPDATE_PAYMENT_TYPE, {
            input: newInputData,
            id: paymentType?.id,
        });

        compareObjects(newInputData, updatedDeliveryType.updatePaymentType);
    });

    it('Successfully deleting an payment type', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const paymentType = await getRandomEntry('paymentType');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const removedPaymentType = await client.request(REMOVE_PAYMENT_TYPE, {
            id: paymentType?.id,
        });

        compareObjects(paymentType, removedPaymentType.removePaymentType);
    });
});

describe('Successful deliver service get/get(many) operations', function() {
    it('Get payment type by id', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const paymentType = await getRandomEntry('paymentType');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const findPaymentType = await client.request(GET_PAYMENT_TYPE, {
            id: paymentType?.id,
        });

        compareObjects(paymentType, findPaymentType.getPaymentType);
    });

    it('Get list of payment type', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const paymentTypes: Array<any> = await prisma.paymentType.findMany();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const listOfPaymentTypes = await client.request(GET_PAYMENT_TYPES);

        const index: number = faker.datatype.number({
            'min': 0,
            'max': paymentTypes.length - 1,
        });

        Object.keys(paymentTypes[index]).forEach((field: string) => {
            expect(getKeyValue<string, any>(field)(paymentTypes[index]))
                .toBe(getKeyValue<string, any>(field)(listOfPaymentTypes?.getPaymentTypes?.[index]));
        });
    });
});

it('Return error "A payment type with this name has already been created"', async function () {
    try {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const newInputData: any = createDataForDeliveryService();

        client.setHeader('Authorization', `Bearer ${ token }`);

        await client.request(CREATE_PAYMENT_TYPE, {
            input: newInputData
        });
        await client.request(CREATE_PAYMENT_TYPE, {
            input: newInputData
        });
    } catch (e: any) {
        expect(e.response.errors.length).toBeTruthy();
        e.response.errors.some((error: any) => {
            return expect(error.message).toEqual('A payment type with this name has already been created');
        });
    }
});
