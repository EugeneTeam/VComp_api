import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

import {
    Gallery as TGallery,
    QueryGetGalleryArgs as TQueryGetGalleryArgs,
    QueryGetGalleriesArgs as TQueryGetGalleriesArgs,
    MutationCreateGalleryArgs as TMutationCreateGalleryArgs,
    MutationUpdateGalleryArgs as TMutationUpdateGalleryArgs,
    MutationRemoveGalleryArgs as TMutationRemoveGalleryArgs,
    GalleryQuantityAndList as TGalleryQuantityAndList
} from '../../graphql';

export default class Gallery extends QueryUtil {
    static resolver(): any {
        this.init('gallery');
        return {
            Query: {
                getGallery: (obj: any, args: TQueryGetGalleryArgs): Promise<TGallery> => {
                    return this.findById(args.id);
                },
                getGalleries: async (obj: any, args: TQueryGetGalleriesArgs): Promise<TGallery> => {
                    return this.findAllAndCount({
                        ...(args?.filter?.name && {
                            name: {
                                contains: args.filter.name,
                            },
                        })
                    }, args?.pagination?.limit, args?.pagination?.offset);
                },
            },
            Mutation: {
                createGallery: async (obj: any, args: TMutationCreateGalleryArgs, context: any): Promise<TGallery> => {
                    await this.errorIfExists({ name: args?.input?.name }, 'A gallery with this name has already been created');
                    return context.prisma.gallery.create({
                        data: args.input,
                    });
                },
                updateGallery: async (obj: any, args: TMutationUpdateGalleryArgs, context: any): Promise<TGallery> => {
                    await this.findById(args.id);
                    await this.errorIfExists({ name: args?.input?.name }, 'A gallery with this name has already been created');
                    return context.prisma.gallery.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeGallery: async (obj: any, args: TMutationRemoveGalleryArgs, context: any): Promise<TGallery> => {
                    return context.prisma.gallery.delete({
                        where: {
                            id: args.id,
                        },
                    });
                },
            }
        }
    }
    static typeDefs(): object {
        return gql`
            
            # TYPES
            
            type Gallery {
                id: Int!
                name: String!
            }

			type GalleryQuantityAndList {
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
