import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const PrismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

const globalForPrisma = global as typeof global & {
  prisma?: ReturnType<typeof PrismaClientSingleton>;
};

const prisma = globalForPrisma.prisma ?? PrismaClientSingleton();
export default prisma;
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
