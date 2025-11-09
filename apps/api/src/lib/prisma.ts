import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
export default prisma; // Ensures one client instance
