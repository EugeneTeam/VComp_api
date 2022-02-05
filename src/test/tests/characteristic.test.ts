import faker from "faker";
import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import {
    createDataForCharacteristic
} from '../factories';
import { EUsers } from '../constants';

import {
    CREATE_CHARACTERISTIC,
    UPDATE_CHARACTERISTIC,
    REMOVE_CHARACTERISTIC,
} from '../../graphql/mutations';
import {
    GET_CHARACTERISTIC,
    GET_CHARACTERISTICS,
} from '../../graphql/queries';
import { getBearerToken } from '../token/generateToken'
import { getKeyValue } from '../../typescript/utils/helper';
import { getRandomEntry, compareObjects } from '../utils/helper';
import { prisma } from "../../config/prismaClient";

const config: any = getConfig();

describe('Successful characteristic creation/update/deletion operations', function() {
    it('Successful creation of a new characteristic', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);
        const category = await getRandomEntry('category');
        const newInputData = createDataForCharacteristic(category?.id);

        client.setHeader('Authorization', `Bearer ${ token }`);

        const newCharacteristic = await client.request(CREATE_CHARACTERISTIC, {
            input: newInputData
        });

        compareObjects(newInputData, newCharacteristic.createCharacteristic);
    });

    it('Successful characteristic update', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);
        const category = await getRandomEntry('category');
        const characteristic = await getRandomEntry('characteristic');
        const newInputData = createDataForCharacteristic(category?.id);

        client.setHeader('Authorization', `Bearer ${ token }`);

        const updatedCharacteristic = await client.request(UPDATE_CHARACTERISTIC, {
            input: newInputData,
            id: characteristic?.id,
        });

        compareObjects(newInputData, updatedCharacteristic.updateCharacteristic);
    });

    it('Successfully deleting a characteristic', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);
        const characteristic = await getRandomEntry('characteristic');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const removedCharacteristic = await client.request(REMOVE_CHARACTERISTIC, {
            id: characteristic?.id,
        });

        compareObjects(characteristic, removedCharacteristic.removeCharacteristic);
    });
});

describe('Successful characteristic get/get(many) operations', function() {
    it('Get characteristic by id', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);
        const characteristic = await getRandomEntry('characteristic');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const findCharacteristic = await client.request(GET_CHARACTERISTIC, {
            id: characteristic?.id,
        });

        compareObjects(characteristic, findCharacteristic.getCharacteristic);
    });

    it('Get list of characteristic', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);
        const characteristics = await prisma.characteristic.findMany();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const listOfCharacteristic = await client.request(GET_CHARACTERISTICS);

        const index = faker.datatype.number({
            'min': 0,
            'max': characteristics.length - 1,
        });

        expect(listOfCharacteristic.getCharacteristics.count).toBe(characteristics.length);
        // @ts-ignore
        Object.keys(characteristics[index]).forEach((field: any) => {
            expect(getKeyValue<string, any>(field)(characteristics[index]))
                .toBe(getKeyValue<string, any>(field)(listOfCharacteristic?.getCharacteristics?.rows?.[index]));
        });
    });
});
