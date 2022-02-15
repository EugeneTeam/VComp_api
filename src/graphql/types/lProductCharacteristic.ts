import { gql } from 'apollo-server';

export default class LProductCharacteristic {
    static typeDefs(): object {
        return gql`
            
            # TYPES
            
            type LProductCharacteristic {
                productId: Int!
                characteristicId: Int!
            }
        `;
    }
}
