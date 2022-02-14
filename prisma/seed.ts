import dotEnv from 'dotenv';
dotEnv.config();

import { PrismaClient } from '@prisma/client';

import { addRoles } from '../src/seeds/roles';
import { addUsers } from '../src/seeds/users';
import { addArticleCategory } from '../src/seeds/articleCategory';
import { addArticles } from '../src/seeds/article';
import { addBanner } from '../src/seeds/banner';
import { addBannerImages } from '../src/seeds/bannerImage';
import { addCallback } from '../src/seeds/callback';
import { addCategory } from '../src/seeds/category';
import { addCharacteristic } from '../src/seeds/characteristic';
import { addDiscounts } from '../src/seeds/discount';
import { addGalleries } from '../src/seeds/gallery';
import { addProducts } from '../src/seeds/product';
import { addComments } from '../src/seeds/comment';
import { addDeliveryServices } from '../src/seeds/deliveryService';
import { addDeliveryTypes } from "../src/seeds/deliveryTypes";
import { addPaymentTypes } from "../src/seeds/paymentTypes";
import { addFavorites } from "../src/seeds/favorites";
import { addImages, addImagesToGallery } from "../src/seeds/image";

import {
    ArticleCategory as IArticleCategory,
} from '../src/graphql';

const prisma: PrismaClient = new PrismaClient();

async function main(): Promise<void> {
    await addRoles(prisma)
        .then(async () => {
            // create user after roles
            await addUsers(prisma);
        });

    if (process.env.NODE_ENV === 'test') {
        await addArticleCategory(prisma, 20)

        const articleCategoryIds: Array<number> = (await prisma.articleCategory.findMany())
            ?.map((item: IArticleCategory) => item.id) || [];
        await addArticles(prisma, 10, articleCategoryIds);

        await addBanner(prisma, 10);

        const bannerIds: Array<number> = (await prisma.banner.findMany())
            ?.map((item: any) => item.id) || [];
        await addBannerImages(prisma, 10, bannerIds);

        await addCallback(prisma, 10);

        await addCategory(prisma, 10, []);

        const categoryIds: Array<number> = (await prisma.category.findMany())
            ?.map((item: any) => item.id) || [];
        await addCategory(prisma, 10, categoryIds);

        await addCharacteristic(prisma, 10, categoryIds);

        await addGalleries(prisma, 10);
        await addDiscounts(prisma, 10);

        const discountIds: Array<number> = (await prisma.discount.findMany())
            ?.map((item: any) => item.id) || [];
        const galleryIds: Array<number> = (await prisma.gallery.findMany())
            ?.map((item: any) => item.id) || [];

        await addProducts(
            prisma,
            10,
            discountIds,
            galleryIds,
            categoryIds
            );

        const productIds: Array<any> = (await prisma.product.findMany())
            ?.map((item: any) => item.id) || [];
        const userIds: Array<any> = (await prisma.user.findMany())
            ?.map((item: any) => item.id) || [];

        await addComments(
            prisma,
            10,
            productIds,
            [],
            userIds);

        const commentIds: Array<number> = (await prisma.comment.findMany())
            ?.map((item: any) => item.id) || [];
        await addComments(
            prisma,
            10,
            productIds,
            commentIds,
            userIds);

        await addDeliveryServices(prisma, 5);
        await addDeliveryTypes(prisma, 5);
        await addPaymentTypes(prisma, 5);

        await addFavorites(prisma, 10, userIds, productIds);

        await addImages(prisma, 20);

        const imageIds = (await prisma.image.findMany())
            ?.map((item: any) => item.id);
        await addImagesToGallery(prisma, 20, galleryIds, imageIds)
    }
}

main().catch(error => {
    console.error(error);
    process.exit(1);
})
.finally(async (): Promise<void> => {
    await prisma.$disconnect();
})
