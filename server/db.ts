import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import { log } from './vite';

// Create connection string from environment variables
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';

// Create a postgres client with the connection string
const client = postgres(connectionString);

// Create a database instance with the client and schema
export const db = drizzle(client, { schema });

// Helper function to initialize database and create tables
export async function initializeDb() {
  try {
    log('Checking database connection...', 'db');
    
    // Create tables if they don't exist - needs to be separate queries
    await client`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );`;
      
    await client`CREATE TABLE IF NOT EXISTS high_scores (
      id SERIAL PRIMARY KEY,
      player_name TEXT NOT NULL,
      final_score INTEGER NOT NULL,
      cash_balance INTEGER NOT NULL,
      bank_balance INTEGER NOT NULL,
      debt INTEGER NOT NULL,
      day_completed INTEGER NOT NULL,
      transaction_history JSONB NOT NULL,
      date_created TIMESTAMP NOT NULL DEFAULT NOW()
    );`;
      
    await client`CREATE TABLE IF NOT EXISTS game_statistics (
      id SERIAL PRIMARY KEY,
      total_games_started INTEGER NOT NULL DEFAULT 0,
      total_games_completed INTEGER NOT NULL DEFAULT 0,
      last_updated TIMESTAMP NOT NULL DEFAULT NOW()
    );`;
      
    await client`CREATE TABLE IF NOT EXISTS daily_snapshots (
      id SERIAL PRIMARY KEY,
      game_id INTEGER NOT NULL,
      day INTEGER NOT NULL,
      cash INTEGER NOT NULL,
      bank INTEGER NOT NULL,
      debt INTEGER NOT NULL,
      net_worth INTEGER NOT NULL,
      timestamp TIMESTAMP NOT NULL DEFAULT NOW()
    );`;
    
    // Check if we need to initialize the game stats record
    const statsCount = await client`SELECT COUNT(*) FROM game_statistics`;
    if (statsCount[0].count === '0') {
      log('Initializing game statistics record...', 'db');
      await client`INSERT INTO game_statistics (total_games_started, total_games_completed) VALUES (0, 0)`;
    }
    
    log('Database initialized successfully', 'db');
  } catch (error) {
    log(`Database initialization error: ${error}`, 'db');
    throw error;
  }
}