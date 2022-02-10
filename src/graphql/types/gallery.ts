import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

export default class Gallery extends QueryUtil {
    static resolver() {
        this.init('gallery');
        return {
            Query: {
                getGallery: (obj: any, args: any) => this.findById(args.id),
                getGalleries: async (obj: any, args: any) => this.findAllAndCount({
                    ...(args?.filter?.name ? {
                        name: {
                            contains: args.filter.name,
                        },
                    } : null)
                }, args?.pagination?.limit, args?.pagination?.offset),
            },
            Mutation: {
                createGallery: async (obj: any, args: any, context: any) => {
                    await this.errorIfExists({ name: args.input.name }, 'A gallery with this name has already been created');
                    return context.prisma.gallery.create({
                        data: args.input,
                    });
                },
                updateGallery: async (obj: any, args: any, context: any) => {
                    await this.findById(args.id);
                    await this.errorIfExists({ name: args.input.name }, 'A gallery with this name has already been created');
                    return context.prisma.gallery.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeGallery: async (obj: any, args: any, context: any) => {
                    return context.prisma.delete({
                        where: {
                            id: args.id,
                        },
                    });
                },
            }
        }
    }
    static typeDefs() {
        return gql`
            
            # TYPES
            
            type Gallery {
                id: Int!
                name: String!
            }

			type GalleryQuantityAndLisr {
                count: Int
                rows: [Gallery]
            }
            
            # INPUTS
            
            input GalleryInput {
                name: String!
            }
            
            input GalleryFilter {
                name: String
            }
        `;
    }
}
