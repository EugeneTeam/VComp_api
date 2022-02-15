import { gql } from 'apollo-server';

export default class LTypeService {
    static typeDefs(): object {
        return gql`
            
            # TYPES
            
            type LTypeService {
                delivryTypeId: Int!
                deliveryServiceId: Int!
            }
        `;
    }
}
