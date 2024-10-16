import process from 'node:process';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Load environment variables from .env file
config({ path: '.env' }); // Or use `.env.local` if needed

// Connect to NeonDB using the serverless connection string
const sql = postgres(process.env.DB_URL!, {
  ssl: 'require', // Ensure SSL is enabled for Neon serverless connections
});

// Initialize Drizzle ORM with Postgres
export const db = drizzle(sql);
