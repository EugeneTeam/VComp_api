import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

export default class BannerImage extends QueryUtil{
    static resolver() {
        this.init('bannerImage');
        return {
            Query: {
                getBannerImage: (obj: any, args: any) => this.findById(args.id),
                getBannerImages: (obj: any, args: any) => this.findAllAndCount(null, args?.pagination?.limit, args?.pagination?.offset),
            },
            Mutation: {
                addBannerImages: async (obj: any, args: any, context: any) => {
                    const result = []
                    for (const image of args.input.images) {
                        const temp = await context.prisma.bannerImage.create({
                            data: args.input,
                            skipDuplicates: true
                        });
                        result.push(temp);
                    }
                    return result;
                },
                updateBannerImage: async (obj: any, args: any, context: any) => {
                    await this.findById(args.id);
                    return context.prisma.bannerImage.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input.input
                    });
                },
                removeBannerImage: async (obj: any, args: any, context: any) => {
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
            
            input ImageBannerPagination {
                limit: Int
                offset: Int
            }
            
            input AddImageBanner {
				bannerId: Int!
				imageUrl: String!
				title: String!
				productUrl: String
            }
        `;
    }
}
