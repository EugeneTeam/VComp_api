import faker from "faker";
import { GraphQLClient } from "graphql-request";
import { getConfig} from '../helper';
import {
    createDataForArticle, createDataForComment
} from '../factories';
import { EUsers } from '../constants';
import {
    ADD_COMMENT,
    REMOVE_COMMENT,
} from '../../graphql/mutations';
import {
    GET_COMMENT,
    GET_COMMENTS,
} from '../../graphql/queries';
import { getBearerToken } from '../token/generateToken'
import { getKeyValue } from '../../typescript/utils/helper';
import { getRandomEntry, compareObjects } from '../utils/helper';
import { prisma } from "../../config/prismaClient";

const config: any = getConfig();

it('Successful added a new comment', async function () {
    const client: GraphQLClient = new GraphQLClient(config.url);
    const token: string = await getBearerToken(EUsers.CUSTOMER, client);
    const product = await getRandomEntry('product');
    const newInputData: any = createDataForComment(null, product?.id);

    client.setHeader('Authorization', `Bearer ${ token }`);

    const newComment = await client.request(ADD_COMMENT, {
        input: newInputData
    });

    compareObjects(newInputData, newComment.addComment);
});

it('Successful remove comment', async function () {
    const client: GraphQLClient = new GraphQLClient(config.url);
    const token: string = await getBearerToken(EUsers.ADMIN, client);
    const comment = await getRandomEntry('comment');
    client.setHeader('Authorization', `Bearer ${ token }`);

    const removedComment = await client.request(REMOVE_COMMENT, {
        id: comment?.id,
    });

    compareObjects(comment, removedComment.removeComment);
});

it('Successful remove comment', async function () {
    try {
        const client: GraphQLClient = new GraphQLClient(config.url);
        const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
        const comment = await getRandomEntry('comment');
        client.setHeader('Authorization', `Bearer ${ token }`);

        const removedComment = await client.request(REMOVE_COMMENT, {
            id: comment?.id,
        });

        compareObjects(comment, removedComment.removeComment);
    } catch (e: any) {
        expect(e.response.errors.length).toBeTruthy();
        e.response.errors.some((error: any) => {
            return expect(error.message).toEqual('Access denied');
        });
    }
});


it('Get comment by id', async function () {
    const client: GraphQLClient = new GraphQLClient(config.url);
    const token: string = await getBearerToken(EUsers.ADMIN, client);
    const comment = await getRandomEntry('comment');

    client.setHeader('Authorization', `Bearer ${ token }`);

    const findComment = await client.request(GET_COMMENT, {
        id: comment?.id,
    });

    compareObjects(comment, findComment.getComment);
});

it('Get list of comment', async function () {
    const client: GraphQLClient = new GraphQLClient(config.url);
    const token: string = await getBearerToken(EUsers.GOVERNING_ARTICLE_MANAGER, client);
    const comments: Array<any> = await prisma.comment.findMany();

    client.setHeader('Authorization', `Bearer ${ token }`);

    const listOfComments = await client.request(GET_COMMENTS);

    const index: number = faker.datatype.number({
        'min': 0,
        'max': comments.length - 1,
    });

    expect(listOfComments.getComments.count).toBe(comments.length);
    // @ts-ignore
    Object.keys(comments[index]).forEach((field: string) => {
        expect(getKeyValue<string, any>(field)(comments[index]))
            .toBe(getKeyValue<string, any>(field)(listOfComments?.getComments?.rows?.[index]));
    });
});
