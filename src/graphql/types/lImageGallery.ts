import { gql } from 'apollo-server';

export default class LImageGallery {
    static typeDefs() {
        return gql`
            
            # TYPES
            
            type LImageGallery {
                imageId: Int!
                galleryId: Int!
            }
            
        `;
    }
}
