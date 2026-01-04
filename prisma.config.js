import { defineConfig } from "prisma/config";

export default defineConfig({
  // Lokasi schema.prisma
  schema: "prisma/schema.prisma",

  // Migrations directory
  migrations: {
    path: "prisma/migrations",
  },

  // Datasource config (pakai env, bukan hardcode)
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
