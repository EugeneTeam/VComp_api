import { gql } from 'apollo-server';

export default class LTypeService {
    static typeDefs() {
        return gql`
            type LTypeService {
                delivryTypeId: Int!
                deliveryServiceId: Int!
            }
        `;
    }
}
