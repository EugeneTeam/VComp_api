import { gql } from 'apollo-server';

export default class LProductList {
    static typeDefs() {
        return gql`
            type LProductList {
                quantity: Int!
                productId: Int!
                orderId: Int!
            }
        `;
    }
}
