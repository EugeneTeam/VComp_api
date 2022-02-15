import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

import {
    Banner as TBanner,
    BannerQuantityAndList as TBannerQuantityAndList,
    MutationCreateBannerArgs as TMutationCreateBannerArgs,
    MutationUpdateBannerArgs as TMutationUpdateBannerArgs,
    MutationRemoveBannerArgs as TMutationRemoveBannerArgs,
    QueryGetBannerArgs as TQueryGetBannerArgs,
    QueryGetBannersArgs as TQueryGetBannersArgs,
} from '../../graphql';

export default class Banner extends QueryUtil{
    static resolver(): any {
        this.init('banner');
        return {
            Query: {
                getBanner: (obj: any, args: TQueryGetBannerArgs): Promise<TBanner> => {
                    return this.findById(args.id);
                },
                getBanners: (obj: any, args: TQueryGetBannersArgs): Promise<TBannerQuantityAndList> => {
                    return this.findAllAndCount(null, args?.pagination?.limit, args?.pagination?.offset)
                },
            },
            Mutation: {
                createBanner: (obj: any, args: TMutationCreateBannerArgs, context: any): Promise<TBanner> => {
                    return context.prisma.banner.create({
                        data: args.input,
                    });
                },
                updateBanner: async (obj: any, args: TMutationUpdateBannerArgs, context: any): Promise<TBanner> => {
                    await this.findById(args.id);
                    return context.prisma.banner.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeBanner: async (obj: any, args: TMutationRemoveBannerArgs, context: any): Promise<TBanner> => {
                    await this.findById(args.id);
                    await context.prisma.bannerImage.deleteMany({
                        where: {
                            bannerId: args.id,
                        },
                    });
                    return context.prisma.banner.delete({
                        where: {
                            id: args.id,
                        },
                    });
                },
            },
        }
    }
    static typeDefs(): object {
        return gql`
            
            #ENUMS
            
            enum BannerPositionX {
                LEFT
                MIDDLE
                RIGHT
            }
            
            enum BannerPositionY {
                TOP
                MIDDLE
                BOTTOM
            }
            
            #TYPES
            
            type Banner {
                id: Int!
                """Name of the page on which the banner is displayed"""
                page: String!
                title: String!
                positionX: BannerPositionX!
                positionY: BannerPositionY!
                html: String!
            }
            
            type BannerQuantityAndList {
                count: Int
                rows: [Banner]
            }
            
            #INPUTS
            
            input BannerInput {
				page: String!
				title: String!
				positionX: BannerPositionX!
				positionY: BannerPositionY!
				html: String!
            }
        `;
    }
}
