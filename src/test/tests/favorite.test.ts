import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import { EUsers } from '../constants';
import {
    ADD_OR_REMOVE_FAVORITE,
} from '../../graphql/mutations';
import { getBearerToken } from '../token/generateToken'
import { getRandomEntry, compareObjects } from '../utils/helper';
import { prisma } from "../../config/prismaClient";

const config: any = getConfig();

describe('Successfully add/remove favorites', function() {
    it('Successfully add favorites', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.CUSTOMER, client);
        const product = await getRandomEntry('product');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const addFavorite = await client.request(ADD_OR_REMOVE_FAVORITE, {
            input: {
                productId: product?.id
            }
        });

        expect(addFavorite).toHaveProperty('addOrRemoveFavorite');
        expect(addFavorite.addOrRemoveFavorite).toHaveProperty('id');
        expect(addFavorite.addOrRemoveFavorite).toHaveProperty('productId');
        expect(addFavorite.addOrRemoveFavorite).toHaveProperty('userId');
        expect(addFavorite.addOrRemoveFavorite.productId).toBe(product.id);
        expect(addFavorite.addOrRemoveFavorite.id).toBeGreaterThan(0);
        expect(addFavorite.addOrRemoveFavorite.userId).toBeGreaterThan(0);
    });

    it('Successfully remove favorites', async function () {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.CUSTOMER, client);
        const favorite = await getRandomEntry('favorite');

        client.setHeader('Authorization', `Bearer ${ token }`);

        const removeFavorite = await client.request(ADD_OR_REMOVE_FAVORITE, {
            input: {
                productId: favorite.productId
            },
        });

        const findFavorite = await prisma.favorite.findUnique({
            where: {
                id: favorite.id,
            },
        });

        compareObjects(favorite, removeFavorite.addOrRemoveFavorite, null, ['userId']);
        expect(findFavorite).toBeNull();
    });
});
