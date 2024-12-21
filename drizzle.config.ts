import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle/migrations',
  schema: './app/db/schema.ts',
  dialect: 'sqlite',
});
