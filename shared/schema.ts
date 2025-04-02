import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const highScores = pgTable("high_scores", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  finalScore: integer("final_score").notNull(),
  cashBalance: integer("cash_balance").notNull(),
  bankBalance: integer("bank_balance").notNull(),
  debt: integer("debt").notNull(),
  dayCompleted: integer("day_completed").notNull(),
  transactionHistory: jsonb("transaction_history").notNull(),
  dateCreated: timestamp("date_created").defaultNow().notNull(),
});

export const gameStatistics = pgTable("game_statistics", {
  id: serial("id").primaryKey(),
  totalGamesStarted: integer("total_games_started").notNull().default(0),
  totalGamesCompleted: integer("total_games_completed").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  completed: boolean("completed").notNull().default(false),
  dateStarted: timestamp("date_started").defaultNow().notNull(),
  dateCompleted: timestamp("date_completed"),
});

export const dailySnapshots = pgTable("daily_snapshots", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  day: integer("day").notNull(),
  cash: integer("cash").notNull(),
  bank: integer("bank").notNull(),
  debt: integer("debt").notNull(),
  netWorth: integer("net_worth").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHighScoreSchema = createInsertSchema(highScores).pick({
  playerName: true,
  finalScore: true,
  cashBalance: true,
  bankBalance: true,
  debt: true,
  dayCompleted: true,
  transactionHistory: true,
});

export const insertDailySnapshotSchema = createInsertSchema(dailySnapshots).pick({
  gameId: true,
  day: true,
  cash: true,
  bank: true,
  debt: true,
  netWorth: true,
});

// Create game schema
export const insertGameSchema = createInsertSchema(games).pick({
  completed: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type HighScore = typeof highScores.$inferSelect;
export type InsertHighScore = z.infer<typeof insertHighScoreSchema>;
export type GameStatistics = typeof gameStatistics.$inferSelect;
export type DailySnapshot = typeof dailySnapshots.$inferSelect;
export type InsertDailySnapshot = z.infer<typeof insertDailySnapshotSchema>;
export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
