import faker from "faker";
import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import { createDataForGallery } from '../factories';
import { EUsers } from '../constants';
import {
    CREATE_GALLERY,
    UPDATE_GALLERY,
    REMOVE_GALLERY,
} from '../../graphql/mutations';
import {
    GET_GALLERY,
    GET_GALLERIES,
} from '../../graphql/queries';
import { getBearerToken } from '../token/generateToken'
import { getKeyValue } from '../../typescript/utils/helper';
import { getRandomEntry, compareObjects } from '../utils/helper';
import { prisma } from "../../config/prismaClient";

const config: any = getConfig();

describe('Successful gallery creation/update/deletion operations', function() {
    it('Successful creation of a new gallery', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);

        const newInputData: any = createDataForGallery();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const newGallery = await client.request(CREATE_GALLERY, {
            input: newInputData
        });

        compareObjects(newInputData, newGallery.createGallery);
    });

    it('Successful gallery update', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const gallery = await getRandomEntry('gallery');
        const newInputData: any = createDataForGallery();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const updatedGallery = await client.request(UPDATE_GALLERY, {
            input: newInputData,
            id: gallery?.id,
        });

        compareObjects(newInputData, updatedGallery.updateGallery);
    });

    it('Successfully deleting a gallery', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const gallery = await getRandomEntry('gallery');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const removedGallery = await client.request(REMOVE_GALLERY, {
            id: gallery!.id,
        });

        compareObjects(gallery, removedGallery.removeGallery);
    });
});

describe('Successful gallery get/get(many) operations', function() {
    it('Get gallery by id', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const gallery = await getRandomEntry('gallery');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const findGallery = await client.request(GET_GALLERY, {
            id: gallery?.id,
        });

        compareObjects(gallery, findGallery.getGallery);
    });

    it('Get list of gallery', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const galleries: Array<any> = await prisma.gallery.findMany();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const listOfGallery = await client.request(GET_GALLERIES);

        const index: number = faker.datatype.number({
            'min': 0,
            'max': galleries.length - 1,
        });

        expect(listOfGallery.getGalleries.count).toBe(galleries.length);
        Object.keys(galleries[index]).forEach((field: string) => {
            expect(getKeyValue<string, any>(field)(galleries[index]))
                .toBe(getKeyValue<string, any>(field)(listOfGallery?.getGalleries?.rows?.[index]));
        });
    });
});
