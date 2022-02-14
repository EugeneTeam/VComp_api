import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import { EUsers } from '../constants';
import { getBearerToken } from '../token/generateToken'
import { getRandomEntry } from '../utils/helper';
import { prisma } from "../../config/prismaClient";
import { incrementView } from '../../typescript/productView';

const config: any = getConfig();

it('Correct operation of the product views counter', async function () {
    const client: GraphQLClient = new GraphQLClient(config.url);
    const token: string = await getBearerToken(EUsers.CUSTOMER, client);
    const product: any = await getRandomEntry('product');

    client.setHeader('Authorization', `Bearer ${ token }`);

    await incrementView(product.id);

    const view: any = await prisma.productView.findFirst({
        where: {
            productId: product.id,
        },
    });

    ['id', 'productId', 'count', 'createdAt', 'updatedAt'].forEach((field: string) => {
        expect(view).toHaveProperty(field);
    });
    expect(view?.productId).toBe(product.id);
    expect(view?.count).toBeGreaterThanOrEqual(1);
});
