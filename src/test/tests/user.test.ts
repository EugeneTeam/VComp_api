import { GraphQLClient } from "graphql-request";
import faker from 'faker';

import { getConfig } from '../helper';
import {
    createDataForCreateOrUpdateUser,
    createDataForSignIn,
    getInputDataForSignIn
} from '../factories';
import { ADMIN_EMAIL, EUsers } from '../constants';
import { CREATE_USER, SIGN_IN } from '../../graphql/mutations';
import { GET_ROLES, LOG_IN } from '../../graphql/queries';
import { User } from '../../graphql';
import { getBearerToken } from '../token/generateToken'
import {
    encryptPassword,
    decryptPassword,
    login, getUserByToken
} from '../../typescript/user';
import { prisma } from "../../config/prismaClient";

const config: any = getConfig();

describe('Successful registration/authorization', function() {
    it('New user registration', async function () {
        const newInputData = createDataForSignIn();
        const client = new GraphQLClient(config.url);
        const newUser: { signIn: User } = await client.request(SIGN_IN, {
            input: newInputData,
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
            id: expect.any(Number),
        });
    });
    it('User authorization', async function() {
        const client = new GraphQLClient(config.url);
        const data = getInputDataForSignIn(EUsers.MANAGER, false);
        const response = await client.request(LOG_IN, {
            input: data,
        });
        expect(response).not.toBeNull();
        expect(response).toHaveProperty(['logIn']);
        expect(response.logIn).toHaveProperty(['token']);
        expect(response.logIn.token).toBeTruthy();
    });
});

describe('Failed registration/authorization', function() {
    it('Return error "Password mismatch"', async function () {
        try {
            const newInputData = createDataForSignIn();
            const client = new GraphQLClient(config.url);

            // change password and call exception
            newInputData.password += faker.random.alphaNumeric(2);

            await client.request(SIGN_IN, {
                input: newInputData,
            });
        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Password mismatch');
            });
        }
    });

    it('Return error "User not found"', async function() {
        try {
            const client = new GraphQLClient(config.url);
            const data = getInputDataForSignIn(EUsers.MANAGER, false);

            // change email and call exception
            data.email += faker.random.alphaNumeric(2);

            await client.request(LOG_IN, {
                input: data,
            });
        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('User not found');
            });
        }
    });

    it('Return error "Wrong login or password"', async function() {
        try {
            const client = new GraphQLClient(config.url);
            const data = getInputDataForSignIn(EUsers.MANAGER, false);

            // change password and call exception
            data.password += faker.random.alphaNumeric(2);

            await client.request(LOG_IN, {
                input: data,
            });
        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Wrong login or password');
            });
        }
    });
});

describe('"User" module method for administrator(CRUD)', function () {
    it ('Admin will create a new user', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.ADMIN, client);

        client.setHeader('Authorization', `Bearer ${ token }`);

        const newInputData = createDataForCreateOrUpdateUser(null,false);
        const newUser: { createUser: User } = await client.request(CREATE_USER, {
            input: newInputData
        })
        expect(newUser).not.toBeNull();
        expect(newUser).toHaveProperty(['createUser']);
        expect(newUser?.createUser?.fullName).toBe(newInputData.fullName);
        expect(newUser?.createUser?.phone).toBe(newInputData.phone);
        expect(newUser?.createUser?.city).toBe(newInputData.city);
        expect(newUser?.createUser?.email).toBe(newInputData.email);
        expect(newUser?.createUser?.status).toBe(newInputData.status);
    });

    it ('The administrator will update the data of an existing user', async function() {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.ADMIN, client);

        client.setHeader('Authorization', `Bearer ${ token }`);

        const newInputData = createDataForCreateOrUpdateUser(null, false);
        const newUser: { createUser: User } = await client.request(CREATE_USER, {
            input: newInputData
        })
        expect(newUser).not.toBeNull();
        expect(newUser).toHaveProperty(['createUser']);
        expect(newUser?.createUser?.fullName).toBe(newInputData.fullName);
        expect(newUser?.createUser?.phone).toBe(newInputData.phone);
        expect(newUser?.createUser?.city).toBe(newInputData.city);
        expect(newUser?.createUser?.email).toBe(newInputData.email);
        expect(newUser?.createUser?.status).toBe(newInputData.status);
    });
});

describe('"User" module method for administrator(EXCEPTIONS)', function () {
    it('New user registration will return a duplicate mail error', async function () {
        const client = new GraphQLClient(config.url);
        const newInputData = createDataForSignIn(ADMIN_EMAIL);
        try {
            await client.request(SIGN_IN, {
                input: newInputData
            })
        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Email is used');
            });
        }
    });

    it ('Return error "Please authorize!"', async function () {
        const client = new GraphQLClient(config.url);
        try {
            await client.request(GET_ROLES)
        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Please authorize!');
            });
        }
    });

    it ('Return error "Access denied"', async function () {
        const client = new GraphQLClient(config.url);
        const token = await getBearerToken(EUsers.MANAGER, client);

        client.setHeader('Authorization', `Bearer ${ token }`);

        try {
            await client.request(GET_ROLES)
        } catch (e: any) {
            expect(e.response.errors.length).toBeTruthy();
            e.response.errors.some((error: any) => {
                return expect(error.message).toEqual('Access denied');
            });
        }
    });
});

describe('Testing additional methods for working with the user model', function () {
    it ('Successful decrypt password', async function () {
        const password: string = faker.lorem.text().replace(/[ ]/g, '').substring(0, 10);
        const passwordForDecrypt: string = await encryptPassword(password);
        const result: boolean = await decryptPassword(password, passwordForDecrypt);
        expect(result).toBe(true);
    });

    it ('Unsuccessful password decryption', async function () {
        const password: string = faker.lorem.text().replace(/[ ]/g, '').substring(0, 10);
        const passwordForDecrypt: string = await encryptPassword(password);
        // added "1" for password to trigger error
        const result: boolean = await decryptPassword(`${password}1`, passwordForDecrypt);
        expect(result).toBe(false);
    });

    it ('Successful login', async function() {
        const user: any = await prisma.user.findFirst();
        const token: string | null = login(false, user.passwordHash);
        expect(token).toBeTruthy();
        expect(token).toMatch(/^[a-zA-Z.\-_0-9]{100,300}$/g)
    });

    it ('Login method  will be return null', async function() {
        const token: string | null = login(false, undefined);
        expect(token).toBeNull();
    });

    it ('getUserByToken method will be return null for wrong token', async function() {
        const password: string = faker.lorem.text().replace(/[ ]/g, '').substring(0, 10);
        const passwordForDecrypt: string = await encryptPassword(password);
        const user: any = await getUserByToken(passwordForDecrypt);
        expect(user).toBeNull();
    });
});
