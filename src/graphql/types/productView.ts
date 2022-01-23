import { gql } from 'apollo-server';

export default class ProductView {
    static typeDefs() {
        return gql`
            
            # TYPES
            
            type ProductView {
                id: Int!
                productId: Int!
                count: Int!
                createdAt: String!
                updatedAt: String!
            }
        `;
    }
}
