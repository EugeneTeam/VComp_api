import { prisma } from "../config/prismaClient";

export const incrementView = async (productId: number): Promise<number> => {
    const entry = await prisma.productView.findMany({
        where: { productId },
    });
    if (!entry?.length) {
        await prisma.productView.create({
            data: {
                productId,
                count: 1,
                updatedAt: new Date(),
            },
        });
        return 1;
    } else {
        const updatedEntry = await prisma.productView.update({
            where: { productId },
            data: {
                count: {
                    increment: 1,
                },
            },
        });

        return updatedEntry.count;
    }
}
