import { gql } from 'apollo-server';

export default class LProductList {
    static typeDefs(): object {
        return gql`
            
            # TYPES
            
            type LProductList {
                quantity: Int!
                productId: Int!
                orderId: Int!
            }
        `;
    }
}
