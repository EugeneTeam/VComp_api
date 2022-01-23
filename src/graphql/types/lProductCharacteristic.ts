import { gql } from 'apollo-server';

export default class LProductCharacteristic {
    static typeDefs() {
        return gql`
            type LProductCharacteristic {
                productId: Int!
                characteristicId: Int!
            }
        `;
    }
}
