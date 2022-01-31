import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import { createDataForBannerImage } from '../factories';
import { EUsers } from '../constants';
import {
    ADD_BANNER_IMAGES,
    UPDATE_BANNER_IMAGE,
    REMOVE_BANNER_IMAGE,
} from '../../graphql/mutations';
import {
    GET_BANNER_IMAGE,
    GET_BANNER_IMAGES,
} from '../../graphql/queries';
import { getBearerToken } from '../token/generateToken'
import { prisma } from "../../config/prismaClient";
import {compareObjects, getRandomEntry} from '../utils/helper';

const config: any = getConfig();

describe('Successful banner image creation/update/deletion operations', function() {
    it('Successful creation of a new image for banner', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.BANNER_MANAGER, client);
        const banner = await getRandomEntry('banner');
        const newInputData = createDataForBannerImage(banner?.id);

        client.setHeader('Authorization', `Bearer ${ token }`);

        const newBannerImage = await client.request(ADD_BANNER_IMAGES, {
            input: [newInputData]
        });

        expect(newBannerImage.addBannerImages).toBeGreaterThanOrEqual(1);
    });

    it('Successful banner image update', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.BANNER_MANAGER, client);
        const banner = await getRandomEntry('banner', {
            where: {
                bannerImage: {
                    some: {
                        id: {
                            NOT: undefined
                        }
                    }
                }
            },
            select: {
                id: true,
                page: true,
                title: true,
                positionX: true,
                positionY: true,
                html: true,
                bannerImage: true
            }
        });
        const newInputData = createDataForBannerImage(banner?.id);

        client.setHeader('Authorization', `Bearer ${ token }`);

        const updatedBanner = await client.request(UPDATE_BANNER_IMAGE, {
            input: newInputData,
            id: banner?.bannerImage?.[0]?.id,
        });

        compareObjects(newInputData, updatedBanner.updateBannerImage);
    });

    it('Successfully deleting an banner image', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.BANNER_MANAGER, client);
        const bannerImage = await getRandomEntry('bannerImage');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const removedBannerImage = await client.request(REMOVE_BANNER_IMAGE, {
            id: bannerImage?.id,
        });

        compareObjects(bannerImage, removedBannerImage.removeBannerImage);
    });
});

describe('Successful banner image get/get(many) operations', function() {
    it('Get banner image by id', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.BANNER_MANAGER, client);
        const bannerImage = await getRandomEntry('bannerImage');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const findBanner = await client.request(GET_BANNER_IMAGE, {
            id: bannerImage?.id,
        });

        compareObjects(bannerImage, findBanner.getBannerImage)
    });

    it('Get list of banner image', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.BANNER_MANAGER, client);

        client.setHeader('Authorization', `Bearer ${ token }`);

        const listOfBanners = await client.request(GET_BANNER_IMAGES);

        expect(listOfBanners).toHaveProperty('getBannerImages');
        expect(listOfBanners?.getBannerImages).toHaveProperty('count');
        expect(listOfBanners?.getBannerImages).toHaveProperty('rows');
        expect(listOfBanners?.getBannerImages?.count).toBeGreaterThanOrEqual(1);
        expect(Array.isArray(listOfBanners?.getBannerImages?.rows)).toBe(true);
    });
});


describe('Permissions return "Access Denied"', function() {
    it('Creating an banner image without permission will return an error', async function () {
        try {
            const client = new GraphQLClient(config.url);
            const token = await getBearerToken(EUsers.BANNER_MANAGER, client);
            const banner = await prisma.banner.findFirst();
            const newInputData = createDataForBannerImage(banner?.id);

            client.setHeader('Authorization', `Bearer ${ token }`);

            await client.request(ADD_BANNER_IMAGES, {
                input: [newInputData]
            });

        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Access denied');
            });
        }
    });
});
