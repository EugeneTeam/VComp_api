import faker from "faker";
import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import { EUsers } from '../constants';
import {
    REQUEST_CALLBACK,
    CLOSE_CALLBACK
} from '../../graphql/mutations';
import { getBearerToken } from '../token/generateToken'
import { getRandomEntry } from '../utils/helper';

const config: any = getConfig();

it('Successful creation of a callback request', async function () {
    const client = new GraphQLClient(config.url);
    const token = await getBearerToken(EUsers.CUSTOMER, client);

    client.setHeader('Authorization', `Bearer ${ token }`);

    let phoneNumber = faker.phone.phoneNumber();

    if (phoneNumber.length > 15) {
        phoneNumber = phoneNumber.substring(0, 14);
    }

    const newRequest = await client.request(REQUEST_CALLBACK, {
        phone: phoneNumber,
    });

    expect(newRequest).toHaveProperty('requestCallback');
    expect(newRequest.requestCallback).toBe(true);
});


describe('Failure creation of a callback request', function() {
    it('Phone number error when creating a callback request', async function () {
        try {
            const client = new GraphQLClient(config.url);
            const token = await getBearerToken(EUsers.CUSTOMER, client);

            client.setHeader('Authorization', `Bearer ${token}`);

            let phoneNumber = faker.phone.phoneNumber();

            if (phoneNumber.length < 15) {
                phoneNumber += phoneNumber;
            }

            await client.request(REQUEST_CALLBACK, {
                phone: phoneNumber,
            });
        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Phone number is too long');
            });
        }
    });

    it('Error on repeated (unprocessed request) request', async function () {
        try {
            const client = new GraphQLClient(config.url);
            const token = await getBearerToken(EUsers.CUSTOMER, client);

            client.setHeader('Authorization', `Bearer ${token}`);
            let phoneNumber = faker.phone.phoneNumber();

            if (phoneNumber.length > 15) {
                phoneNumber = phoneNumber.substring(0, 14);
            }

            await client.request(REQUEST_CALLBACK, {
                phone: phoneNumber,
            });

            await client.request(REQUEST_CALLBACK, {
                phone: phoneNumber,
            });
        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('You have already requested a call back. Please wait response');
            });
        }
    });
});

describe('Close callback', function() {
    it('Return error "Access denied"', async function () {
        try {
            const client = new GraphQLClient(config.url);
            const token = await getBearerToken(EUsers.CUSTOMER, client);

            client.setHeader('Authorization', `Bearer ${ token }`);

            const callback = await getRandomEntry('callback');

            await client.request(CLOSE_CALLBACK, {
                id: callback.id,
            });

        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Access denied');
            });
        }
    });

    it('Successfully closing the callback', async function() {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);

        client.setHeader('Authorization', `Bearer ${ token }`);

        const callback = await getRandomEntry('callback', {
            where: {
                isProcessed: true,
            },
        });

        const closeRequest = await client.request(CLOSE_CALLBACK, {
            id: callback.id,
        });

        expect(closeRequest).toHaveProperty('closeCallback');
        expect(closeRequest.closeCallback).toBe(true);
    });

    it('Return error "Callback is closed"', async function() {
        try {
            const client = new GraphQLClient(config.url);
            const token = await getBearerToken(EUsers.MANAGER, client);

            client.setHeader('Authorization', `Bearer ${ token }`);

            const callback = await getRandomEntry('callback', {
                where: {
                    isProcessed: true,
                },
            });

            client.request(CLOSE_CALLBACK, {
                id: callback.id,
            });
            client.request(CLOSE_CALLBACK, {
                id: callback.id,
            });

        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Callback is closed');
            });
        }
    });
});
