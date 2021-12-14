import {PrismaClient} from '@prisma/client';

import {addRoles} from '../src/seeds/roles';
import {addUsers} from '../src/seeds/users';

const prisma: PrismaClient = new PrismaClient();

async function main() {
    await addRoles(prisma)
        .then(async () => {
            // create user after roles
            await addUsers(prisma);
        });
}

main().catch(error => {
    console.error(error);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
})
