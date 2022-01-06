import {GraphQLClient} from "graphql-request";

import {getConfig} from '../helper';
import {createDataForSignIn} from '../factories/user';
import {ADMIN_EMAIL} from '../constants';
import {SIGN_IN} from '../../graphql/mutations';

const config: any = getConfig();

describe('User graphql methods ', function () {
    it('New user registration', async function () {

        const newInputData = createDataForSignIn();
        const client = new GraphQLClient(config.url);
        const newUser = await client.request(SIGN_IN, {
            input: {
                fullName: newInputData.fullName,
                phone: newInputData.phone,
                city: newInputData.city,
                email: newInputData.email,
                password: newInputData.password,
                repeatPassword: newInputData.repeatPassword,
            }
        });

        expect(newUser).not.toBeNull();
        expect(newUser).toHaveProperty(['signIn']);
        expect(newUser.signIn).toMatchObject({
            roleId: expect.any(Number),
            googleId: null,
            resetPasswordToken: null,
            passwordHash: expect.any(String),
            activationToken: expect.any(String),
            banReason: null,
            status: 'INACTIVE',
            email: expect.any(String),
            city: expect.any(String),
            phone: expect.any(String),
            fullName: expect.any(String),
            id: expect.any(Number)
        })
    });

    it('New user registration will return a duplicate mail error', async function () {
        const client = new GraphQLClient(config.url);
        const newInputData = USER.FACTORY.createDataForSignIn(ADMIN_EMAIL);
        try {
            await client.request(USER.GRAPHQL.MUTATIONS.SIGN_IN, {
                fullName: newInputData.fullName,
                phone: newInputData.phone,
                city: newInputData.city,
                email: newInputData.email,
                password: newInputData.password,
                repeatPassword: newInputData.repeatPassword,
            })
        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Email is used')
            })
        }
    })
});
