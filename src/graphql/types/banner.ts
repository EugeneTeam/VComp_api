import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

export default class Banner extends QueryUtil{
    static resolver() {
        this.init('banner');
        return {
            Query: {
                getBanner: (obj: any, args: any) => this.findById(args.id),
                getBanners: (obj: any, args: any) => this.findAllAndCount(null, args?.pagination?.limit, args?.pagination?.offset),
            },
            Mutation: {
                createBanner: (obj: any, args: any, context: any) => {
                    return context.prisma.banner.create({
                        data: args.input,
                    });
                },
                updateBanner: async (obj: any, args: any, context: any) => {
                    await this.findById(args.id);
                    return context.prisma.banner.update({
                        where: {
                            id: args.id,
                        },
                        date: args.input,
                    });
                },
                removeBanner: async (obj: any, args: any, context: any) => {
                    await this.findById(args.id);
                    return context.prisma.banner.delete({
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
                id: Int
                page: String
                title: String
                positionX: BannerPositionX
                positionY: BannerPositionY
                html: String
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
