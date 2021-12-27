import {GraphQLClient} from "graphql-request";
import {getConfig} from '../helper';

const config: any = getConfig();

test('Unauthorized', async () => {
   const client = new GraphQLClient(config.url);
   let query = `query GetRoles { getRoles { name id } }`;
   try {
       await client.request(query);
   } catch (error) {
       // @ts-ignore
       expect(error.response.errors.some(error => error.message === 'Please authorize!')).toBe(true)
   }
});
