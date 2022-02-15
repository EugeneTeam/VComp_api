import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';
import {
    MutationAddBannerImagesArgs as TMutationAddBannerImagesArgs,
    MutationRemoveBannerImageArgs as TMutationRemoveBannerImageArgs,
    MutationUpdateBannerImageArgs as TMutationUpdateBannerImageArgs,
    QueryGetBannerImageArgs as TQueryGetBannerImageArgs,
    QueryGetBannerImagesArgs as TQueryGetBannerImagesArgs,
    ImageBanner as TImageBanner,
    ImageBannerQuantityAndList as TImageBannerQuantityAndList,
} from '../../graphql';

export default class BannerImage extends QueryUtil{
    static resolver(): any {
        this.init('bannerImage');
        return {
            Query: {
                getBannerImage: (obj: any, args: TQueryGetBannerImageArgs): Promise<TImageBanner> => {
                    return this.findById(args.id);
                },
                getBannerImages: (obj: any, args: TQueryGetBannerImagesArgs): Promise<TImageBannerQuantityAndList> => {
                    return this.findAllAndCount(null, args?.pagination?.limit, args?.pagination?.offset);
                },
            },
            Mutation: {
                addBannerImages: async (obj: any, args: TMutationAddBannerImagesArgs, context: any): Promise<number> => {
                    const data: { count: number } = await context.prisma.bannerImage.createMany({
                        data: args.input,
                    });
                    return data.count;
                },
                updateBannerImage: async (obj: any, args: TMutationUpdateBannerImageArgs, context: any): Promise<TImageBanner> => {
                    await this.findById(args.id);
                    return context.prisma.bannerImage.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeBannerImage: async (obj: any, args: TMutationRemoveBannerImageArgs, context: any): Promise<TImageBanner> => {
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
    static typeDefs(): object {
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
