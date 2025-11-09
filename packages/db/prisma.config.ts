import { defineConfig } from "prisma/config";
import { config } from 'dotenv';

// Load .env file
config({ path: '.env' }); // or './prisma/.env' if .env is inside prisma folder

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "./node_modules/.bin/tsx prisma/seed.ts"
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
