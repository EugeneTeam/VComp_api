import dotEnv from 'dotenv';
dotEnv.config();

import { PrismaClient } from '@prisma/client';

import { addRoles } from '../src/seeds/roles';
import { addUsers } from '../src/seeds/users';
import { addArticleCategory } from '../src/seeds/articleCategory';
import { addArticles } from '../src/seeds/article';
import { addBanner } from '../src/seeds/banner';
import { addBannerImages } from '../src/seeds/bannerImage';

const prisma: PrismaClient = new PrismaClient();

async function main() {
    await addRoles(prisma)
        .then(async () => {
            // create user after roles
            await addUsers(prisma);
        });

    if (process.env.NODE_ENV === 'test') {
        await addArticleCategory(prisma, 20)
        const articles: any = await prisma.articleCategory.findMany();
        await addArticles(prisma, 10, articles.map((item: any) => item.id));
        await addBanner(prisma, 10);
        const banners: any = await prisma.banner.findMany();
        await addBannerImages(prisma, 10, banners.map((item: any) => item.id));
    }
}

main().catch(error => {
    console.error(error);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
})
