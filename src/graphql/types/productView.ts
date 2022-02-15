import { gql } from 'apollo-server';

export default class ProductView {
    static typeDefs(): object {
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
