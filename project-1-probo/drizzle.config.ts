import type { Config } from 'drizzle-kit';
import process from 'node:process';

export default {
  schema: './src/schema/*',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  },
  // tablesFilter: ['project_1_*'],
  out: './drizzle',
} satisfies Config;
