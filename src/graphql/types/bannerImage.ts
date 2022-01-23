import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';
import {
    MutationAddBannerImagesArgs as IMutationAddBannerImagesArgs,
    MutationRemoveBannerImageArgs as IMutationRemoveBannerImageArgs,
    MutationUpdateBannerImageArgs as IMutationUpdateBannerImageArgs,
    QueryGetBannerImageArgs as IQueryGetBannerImageArgs,
    QueryGetBannerImagesArgs as IQueryGetBannerImagesArgs,
    ImageBanner as IImageBanner,
    ImageBannerQuantityAndList as IImageBannerQuantityAndList,
} from '../../graphql';

export default class BannerImage extends QueryUtil{
    static resolver() {
        this.init('bannerImage');
        return {
            Query: {
                getBannerImage: (obj: any, args: IQueryGetBannerImageArgs): Promise<IImageBanner> => this.findById(args.id),
                getBannerImages: (obj: any, args: IQueryGetBannerImagesArgs): Promise<IImageBannerQuantityAndList> => {
                    return this.findAllAndCount(null, args?.pagination?.limit, args?.pagination?.offset);
                },
            },
            Mutation: {
                addBannerImages: async (obj: any, args: IMutationAddBannerImagesArgs, context: any): Promise<Array<BannerImage>> => {
                    const result = [];
                    if (args?.input) {
                        for (const image of args.input) {
                            const temp = await context.prisma.bannerImage.create({
                                data: args.input,
                                skipDuplicates: true,
                            });
                            result.push(temp);
                        }
                    }
                    return result;
                },
                updateBannerImage: async (obj: any, args: IMutationUpdateBannerImageArgs, context: any): Promise<IImageBanner> => {
                    await this.findById(args.id);
                    return context.prisma.bannerImage.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeBannerImage: async (obj: any, args: IMutationRemoveBannerImageArgs, context: any): Promise<IImageBanner> => {
                    await this.findById(args.id);
                    return context.prisma.bannerImage.delete({
                        where: {
                            id: args.id,
                        },
                    });
                }
            },
        }
    }
    static typeDefs() {
        return gql`
            
            # types
            
            type ImageBanner {
                id: Int
                bannerId: Int
                imageUrl: String
                title: String
                productUrl: String
            }
            
            type ImageBannerQuantityAndList {
                count: Int
                rows: [ImageBanner]
            }
            
            # INPUTS
            
            input AddImageBanner {
				bannerId: Int!
				imageUrl: String!
				title: String!
				productUrl: String
            }
        `;
    }
}
