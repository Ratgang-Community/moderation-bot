import { PrismaClient } from '@prisma/client';

// creating a new prisma client instance
const prisma = new PrismaClient();

// exporting the prisma client instance
export default prisma;