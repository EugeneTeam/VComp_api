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

import {
    ArticleCategory as IArticleCategory,
    Banner as IBanner,
    Category as ICategory,
    Discount as IDiscount,
    Gallery as IGallery,
    Product as IProduct,
    Comment as IComment,
    User as IUser
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

        const articles: Array<IArticleCategory> = await prisma.articleCategory.findMany();
        await addArticles(prisma, 10, articles.map((item: IArticleCategory) => item.id));

        await addBanner(prisma, 10);

        const banners: Array<any> = await prisma.banner.findMany();
        await addBannerImages(prisma, 10, banners.map((item: IBanner) => item.id));

        await addCallback(prisma, 10);

        await addCategory(prisma, 10, []);

        const categories: Array<ICategory> = await prisma.category.findMany();
        await addCategory(prisma, 10, categories.map((item: any) => item.id));

        await addCharacteristic(prisma, 10, categories.map((item: any) => item.id));

        await addGalleries(prisma, 10);
        await addDiscounts(prisma, 10);

        const discounts: Array<any> = await prisma.discount.findMany();
        const galleries: Array<IGallery> = await prisma.gallery.findMany();

        await addProducts(
            prisma,
            10,
            discounts.map((item: IDiscount) => item.id),
            galleries.map((item: IGallery) => item.id),
            categories.map((item: ICategory) => item.id)
            );

        const products: Array<any> = await prisma.product.findMany();
        const users: Array<any> = await prisma.user.findMany();

        await addComments(
            prisma,
            10,
            products.map((item: IProduct) => item.id),
            [],
            users.map((item: IUser) => item.id));

        const comments: Array<any> = await prisma.comment.findMany();
        await addComments(
            prisma,
            10,
            products.map((item: IProduct) => item.id),
            comments.map((item: IComment) => item.id),
            users.map((item: IUser) => item.id));

    }
}

main().catch(error => {
    console.error(error);
    process.exit(1);
})
.finally(async (): Promise<void> => {
    await prisma.$disconnect();
})
