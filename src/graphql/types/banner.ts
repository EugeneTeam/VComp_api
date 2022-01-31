import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

import {
    Banner as IBanner,
    BannerQuantityAndList as IBannerQuantityAndList,
    MutationCreateBannerArgs as IMutationCreateBannerArgs,
    MutationUpdateBannerArgs as IMutationUpdateBannerArgs,
    MutationRemoveBannerArgs as IMutationRemoveBannerArgs,
    QueryGetBannerArgs as IQueryGetBannerArgs,
    QueryGetBannersArgs as IQueryGetBannersArgs,
} from '../../graphql';

export default class Banner extends QueryUtil{
    static resolver() {
        this.init('banner');
        return {
            Query: {
                getBanner: (obj: any, args: IQueryGetBannerArgs): Promise<IBanner> => this.findById(args.id),
                getBanners: (obj: any, args: IQueryGetBannersArgs): Promise<IBannerQuantityAndList> => {
                    return this.findAllAndCount(null, args?.pagination?.limit, args?.pagination?.offset)
                },
            },
            Mutation: {
                createBanner: (obj: any, args: IMutationCreateBannerArgs, context: any): Promise<IBanner> => {
                    return context.prisma.banner.create({
                        data: args.input,
                    });
                },
                updateBanner: async (obj: any, args: IMutationUpdateBannerArgs, context: any): Promise<IBanner> => {
                    await this.findById(args.id);
                    return context.prisma.banner.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeBanner: async (obj: any, args: IMutationRemoveBannerArgs, context: any): Promise<IBanner> => {
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
    static typeDefs() {
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
