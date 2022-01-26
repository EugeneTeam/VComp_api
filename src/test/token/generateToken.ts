import {getInputDataForSignIn} from '../factories';
import {EUsers} from '../constants';
import {LOG_IN} from "../../graphql/queries";

export const getBearerToken = async (user: EUsers, client: any) => {
    const data = getInputDataForSignIn(user, false);

    const response = await client.request(LOG_IN, {
        input: data,
    });

    return response?.logIn.token;
}
