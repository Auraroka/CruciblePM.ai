import { prisma } from './prisma';

// To be extended if we need DB adapters other than Prisma
export const db = prisma;
