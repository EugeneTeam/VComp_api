import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

export default class Image extends QueryUtil{
    static resolver() {
        this.init('image');
        return {
            Query: {
                getImage: (obj: any, args: any) => this.findById(args.id),
            },
            Mutation: {
                addImages: async (obj: any, args: any, context: any) => {
                    await this.setAnotherTableForNextRequest('gallery');
                    await this.findById(args.input.galleryId);
                    let result = [];
                    for (const image of args.input.images) {
                        const newImage = await context.prisma.image.create({
                            data: image,
                        });
                        await context.prisma.lImageGallery.create({
                            imageId: newImage.id,
                            galleryId: args.input.galleryId,
                        });
                        result.push(newImage);
                    }
                    return result;
                },
                removeImages: async (obj: any, args: any, context: any) => {
                    await this.setAnotherTableForNextRequest('gallery');
                    await this.findById(args.input.galleryId);
                    let result = [];

                    for (const imageId of args.input.imagesIds) {
                        await context.prisma.lImageGallery.delete({
                            where: {
                                galleryId: args.input.galleryId,
                                imageId,
                            },
                        });

                        if (args.input.destroyImages) {
                            const deletedImage = await context.prisma.image.delete({
                                where: {
                                    id: imageId,
                                },
                            });
                            result.push(deletedImage);
                        }
                    }
                    return result;
                },
                updateImage: async (obj: any, args: any, context: any) => {
                    await this.findById(args.id);
                    return context.prisma.image.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
            },
        }
    }
    static typeDefs() {
        return gql`
            
            # TYPES 
            
            type Image {
                id: Int!
                name: String!
                url: String!
                order: Int!
            }
            
            # INPUTS
            
            input ImageInput {
				name: String!
				url: String!
				order: Int!
            }
            
            input AddImages {
                images: [ImageInput!]!
                galleryId: Int!
            }
            
            input RemoveImages {
                galleryId: Int!
                imageIds: [Int!]!
                """
                \nRemove images from gallery and from table Image if set to true
                \nRemove iamges only form gallery if set to false
                """
                destroyImages: Boolean = false
            }
        `;
    }
}
