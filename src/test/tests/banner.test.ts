import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import {
    createDataForBanner
} from '../factories';
import { EUsers } from '../constants';
import {
    CREATE_BANNER,
    UPDATE_BANNER,
    REMOVE_BANNER,
} from '../../graphql/mutations';
import {
    GET_BANNER,
    GET_BANNERS,
} from '../../graphql/queries';
import { getBearerToken } from '../token/generateToken'
import {compareObjects, getRandomEntry} from '../utils/helper';
import {
    Banner as IBanner,
    BannerInput as IBannerInput,
    BannerQuantityAndList as IBannerQuantityAndList
} from '../../graphql';

const config: any = getConfig();

describe('Successful banner creation/update/deletion operations', function() {
    it('Successful creation of a new banner', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.BANNER_MANAGER, client);
        const newInputData: any = createDataForBanner();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const newBanner: { createBanner: IBanner } = await client.request(CREATE_BANNER, {
            input: newInputData
        });

        compareObjects(newInputData, newBanner.createBanner);
    });

    it('Successful banner update', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.BANNER_MANAGER, client);
        const banner: IBanner = await getRandomEntry('banner');
        const newInputData: any = createDataForBanner();

        client.setHeader('Authorization', `Bearer ${ token }`);

        const updatedBanner = await client.request(UPDATE_BANNER, {
            input: newInputData,
            id: banner?.id,
        });

        compareObjects(newInputData, updatedBanner.updateBanner);
    });

    it('Successfully deleting an banner', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.BANNER_MANAGER, client);
        const banner: IBanner = await getRandomEntry('banner');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const removedBanner = await client.request(REMOVE_BANNER, {
            id: banner?.id,
        });

        compareObjects(banner, removedBanner.removeBanner);
    });
});

describe('Successful banner get/get(many) operations', function() {
    it('Get banner by id', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.BANNER_MANAGER, client);
        const banner: IBanner = await getRandomEntry('banner');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const findBanner: { getBanner: IBanner } = await client.request(GET_BANNER, {
            id: banner?.id,
        });

        compareObjects(banner, findBanner.getBanner)
    });

    it('Get list of banner', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.BANNER_MANAGER, client);

        client.setHeader('Authorization', `Bearer ${ token }`);

        const listOfBanners: { getBanners: IBannerQuantityAndList } = await client.request(GET_BANNERS);

        expect(listOfBanners).toHaveProperty('getBanners');
        expect(listOfBanners?.getBanners).toHaveProperty('count');
        expect(listOfBanners?.getBanners).toHaveProperty('rows');
        expect(listOfBanners?.getBanners?.count).toBeGreaterThanOrEqual(1);
        expect(Array.isArray(listOfBanners?.getBanners?.rows)).toBe(true);
        expect(listOfBanners?.getBanners?.rows?.length).toBeGreaterThanOrEqual(1);
    });
});


describe('Permissions return "Access Denied"', function() {
    it('Creating an banner without permission will return an error', async function () {
        try {
            const client: GraphQLClient = new GraphQLClient(config.url);
            const token: string = await getBearerToken(EUsers.CUSTOMER, client);
            const newInputData: any = createDataForBanner();

            client.setHeader('Authorization', `Bearer ${ token }`);

            await client.request(CREATE_BANNER, {
                input: newInputData,
            });

        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Access denied');
            });
        }
    });
});

