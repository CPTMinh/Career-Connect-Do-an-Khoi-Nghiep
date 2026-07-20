import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.user.findFirst({ where: { role: 'MENTEE' } }).then((u: any) => {
    console.log("Mentee ID:", u?.id);
    prisma.$disconnect();
});
