import { PrismaClient } from '@prisma/client';
import {
    encryptPassword,
    generateActivationToken
} from '../typescript/user';

export async function addUsers(prisma: PrismaClient): Promise<any> {
    const roles: Array<{id: number, name: string}> = await prisma.role.findMany();
    return prisma.user.createMany({
        data: [{
                fullName: "Admin",
                phone: "+380000000000",
                city: "Dnepr",
                email: "admin@gmail.com",
                activationToken: generateActivationToken(),
                passwordHash: await encryptPassword("123456789"),
                status: "ACTIVE",
                // @ts-ignore
                roleId: (roles.find(item => item.name === 'ADMIN'))?.id,
                banReason: null,
                createdAt: new Date(),
                resetPasswordToken: null,
                googleId: null,
            }, {
                fullName: "Manager",
                phone: "+380000000000",
                city: "Dnepr",
                email: "manager@gmail.com",
                activationToken: generateActivationToken(),
                passwordHash: await encryptPassword("123456789"),
                status: "ACTIVE",
                // @ts-ignore
                roleId: (roles.find(item => item.name === 'MANAGER'))?.id,
                banReason: null,
                createdAt: new Date(),
                resetPasswordToken: null,
                googleId: null,
            }, {
                fullName: "Customer",
                phone: "+380000000000",
                city: "Dnepr",
                email: "customer@gmail.com",
                activationToken: generateActivationToken(),
                passwordHash: await encryptPassword("123456789"),
                status: "ACTIVE",
                // @ts-ignore
                roleId: (roles.find(item => item.name === 'CUSTOMER'))?.id,
                banReason: null,
                createdAt: new Date(),
                resetPasswordToken: null,
                googleId: null,
            }, {
                fullName: "GoverningManager",
                phone: "+380000000000",
                city: "Dnepr",
                email: "governing.manager@gmail.com",
                activationToken: generateActivationToken(),
                passwordHash: await encryptPassword("123456789"),
                status: "ACTIVE",
                // @ts-ignore
                roleId: (roles.find(item => item.name === 'GOVERNING_ARTICLES'))?.id,
                banReason: null,
                createdAt: new Date(),
                resetPasswordToken: null,
                googleId: null,
            }, {
                fullName: "BannerManager",
                phone: "+380000000000",
                city: "Dnepr",
                email: "banner.manager@gmail.com",
                activationToken: generateActivationToken(),
                passwordHash: await encryptPassword("123456789"),
                status: "ACTIVE",
                // @ts-ignore
                roleId: (roles.find(item => item.name === 'BANNER_MANAGER'))?.id,
                banReason: null,
                createdAt: new Date(),
                resetPasswordToken: null,
                googleId: null,
            }],
        skipDuplicates: true
    });
}
