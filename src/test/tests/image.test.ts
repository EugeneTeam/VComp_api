import faker from "faker";
import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import {
    createDataForImage
} from '../factories';
import { EUsers } from '../constants';
import {
    ADD_IMAGES,
    REMOVE_IMAGES,
    UPDATE_IMAGE,
} from '../../graphql/mutations';
import {
    GET_IMAGE,
} from '../../graphql/queries';
import { getBearerToken } from '../token/generateToken'
import { getRandomEntry, compareObjects } from '../utils/helper';
import { prisma } from "../../config/prismaClient";

const config: any = getConfig();

describe('Successful images add/update/deletion operations', function() {
    it('Successful creation of a new article', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const imagesCount: number = faker.datatype.number({ min: 1, max: 10 });
        const newInputData: any = createDataForImage(imagesCount);
        const gallery: any = await getRandomEntry('gallery');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const imagesInGallery = await client.request(ADD_IMAGES, {
            input: {
                images: newInputData,
                galleryId: gallery?.id
            }
        });

        expect(imagesInGallery).toHaveProperty('addImages');
        expect(Array.isArray(imagesInGallery.addImages)).toBe(true);
        expect(imagesInGallery.addImages.length).toBe(imagesCount);

        const index = faker.datatype.number({
            min: 0,
            max: imagesCount - 1
        });

        compareObjects(newInputData[index], imagesInGallery.addImages[index]);
    });

    it('Successful article update', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.MANAGER, client);
        const image: any = await getRandomEntry('image');
        const newInputData: any = createDataForImage()[0];

        client.setHeader('Authorization', `Bearer ${ token }`);

        const updatedImage = await client.request(UPDATE_IMAGE, {
            input: newInputData,
            id: image?.id,
        });

        compareObjects(newInputData, updatedImage.updateImage);
    });

    it('Successfully deleting an images from gallery (without destroy images)', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const gallery = await getRandomEntry('gallery', {
            where: {
                lImageGallery : {
                    some: {
                        imageId: {
                            NOT: undefined,
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                lImageGallery: {
                    select: {
                        image: true,
                    },
                },
            },
        });

        const imageIds: Array<number> = gallery.lImageGallery.map((item: any) => item.image.id);
        client.setHeader('Authorization', `Bearer ${ token }`);

        const removedImages = await client.request(REMOVE_IMAGES, {
            input: {
                galleryId: gallery.id,
                imageIds: imageIds,
                destroyImages: false,
            },
        });

        expect(removedImages).toHaveProperty('removeImages');
        removedImages.removeImages.forEach((item: any) => {
            expect(item.type).toBe('RELATION');
            expect(imageIds.includes(item.id)).toBe(true);
        });

        const randomImageId = imageIds[faker.datatype.number({ min: 0, max: imageIds.length - 1})];

        const image = await prisma.image.findUnique({
            where: {
                id: randomImageId,
            },
        });

        expect(image).toBeTruthy();
        ['id', 'name', 'url', 'order'].forEach((field: string) => {
            expect(image).toHaveProperty(field);
        });
    });

    it('Successfully deleting an images from gallery (with destroy images)', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.ADMIN, client);
        const gallery = await getRandomEntry('gallery', {
            where: {
                lImageGallery : {
                    some: {
                        imageId: {
                            NOT: undefined,
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                lImageGallery: {
                    select: {
                        image: true,
                    },
                },
            },
        });

        const imageIds: Array<number> = gallery.lImageGallery.map((item: any) => item.image.id);
        client.setHeader('Authorization', `Bearer ${ token }`);

        const removedImages = await client.request(REMOVE_IMAGES, {
            input: {
                galleryId: gallery.id,
                imageIds: imageIds,
                destroyImages: true,
            },
        });

        expect(removedImages).toHaveProperty('removeImages');
        removedImages.removeImages.forEach((item: any) => {
            expect(imageIds.includes(item.id)).toBe(true);
        });

        const randomImageId = imageIds[faker.datatype.number({ min: 0, max: imageIds.length - 1})];
        const image = await prisma.image.findUnique({
            where: {
                id: randomImageId,
            },
        });
        expect(image).toBeNull();
    });
});

it('Get image by id', async function () {
    const client: GraphQLClient = new GraphQLClient(config.url);
    const token: string = await getBearerToken(EUsers.ADMIN, client);
    const image = await getRandomEntry('image');

    client.setHeader('Authorization', `Bearer ${ token }`);

    const findImage = await client.request(GET_IMAGE, {
        id: image?.id,
    });

    compareObjects(image, findImage.getImage);
});
