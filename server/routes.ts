import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db, initializeDb } from "./db";
import { desc, eq, sql } from "drizzle-orm";
import { 
  gameStatistics, 
  highScores, 
  dailySnapshots, 
  insertHighScoreSchema,
  insertDailySnapshotSchema  
} from "../shared/schema";
import { z } from "zod";

// Schema for high score submission
const submitScoreSchema = z.object({
  playerName: z.string().min(1).max(100),
  finalScore: z.number().int().positive(),
  cashBalance: z.number().int(),
  bankBalance: z.number().int(),
  debt: z.number().int(),
  dayCompleted: z.number().int().min(1).max(30),
  transactionHistory: z.array(z.any()),
  dailySnapshots: z.array(z.object({
    day: z.number().int().min(1).max(30),
    cash: z.number().int(),
    bank: z.number().int(),
    debt: z.number().int(),
    netWorth: z.number().int()
  }))
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the database
  await initializeDb();
  
  // API health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Game server is running' });
  });

  // Get top 10 high scores
  app.get('/api/highscores', async (req, res) => {
    try {
      const scores = await db.select()
        .from(highScores)
        .orderBy(desc(highScores.finalScore))
        .limit(10);
      
      res.json({ scores });
    } catch (error) {
      console.error('Error fetching high scores:', error);
      res.status(500).json({ error: 'Failed to fetch high scores' });
    }
  });

  // Submit a new high score
  app.post('/api/highscores', async (req, res) => {
    try {
      // Validate request body
      const validatedData = submitScoreSchema.parse(req.body);
      
      // Insert the high score
      const [newScore] = await db.insert(highScores)
        .values({
          playerName: validatedData.playerName,
          finalScore: validatedData.finalScore,
          cashBalance: validatedData.cashBalance,
          bankBalance: validatedData.bankBalance,
          debt: validatedData.debt,
          dayCompleted: validatedData.dayCompleted,
          transactionHistory: validatedData.transactionHistory,
        })
        .returning();
      
      // Insert daily snapshots with the game ID
      if (validatedData.dailySnapshots && validatedData.dailySnapshots.length > 0) {
        const snapshots = validatedData.dailySnapshots.map(snapshot => ({
          gameId: newScore.id,
          day: snapshot.day,
          cash: snapshot.cash,
          bank: snapshot.bank,
          debt: snapshot.debt,
          netWorth: snapshot.netWorth
        }));
        
        await db.insert(dailySnapshots).values(snapshots);
      }
      
      // Update game statistics - increment completed games
      await db.update(gameStatistics)
        .set({ 
          totalGamesCompleted: sql`total_games_completed + 1`,
          lastUpdated: new Date()
        });
      
      res.status(201).json({ success: true, scoreId: newScore.id });
    } catch (error) {
      console.error('Error submitting high score:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid score data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to submit high score' });
      }
    }
  });

  // Get game statistics
  app.get('/api/statistics', async (req, res) => {
    try {
      const stats = await db.select().from(gameStatistics).limit(1);
      res.json(stats[0] || { totalGamesStarted: 0, totalGamesCompleted: 0 });
    } catch (error) {
      console.error('Error fetching game statistics:', error);
      res.status(500).json({ error: 'Failed to fetch game statistics' });
    }
  });

  // Record a new game started
  app.post('/api/statistics/game-started', async (req, res) => {
    try {
      await db.update(gameStatistics)
        .set({ 
          totalGamesStarted: sql`total_games_started + 1`,
          lastUpdated: new Date()
        });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating game statistics:', error);
      res.status(500).json({ error: 'Failed to update game statistics' });
    }
  });

  // Get daily snapshots for a specific game
  app.get('/api/games/:gameId/snapshots', async (req, res) => {
    try {
      const gameId = parseInt(req.params.gameId);
      
      if (isNaN(gameId)) {
        return res.status(400).json({ error: 'Invalid game ID' });
      }
      
      const snapshots = await db.select()
        .from(dailySnapshots)
        .where(eq(dailySnapshots.gameId, gameId))
        .orderBy(dailySnapshots.day);
      
      res.json({ snapshots });
    } catch (error) {
      console.error('Error fetching game snapshots:', error);
      res.status(500).json({ error: 'Failed to fetch game snapshots' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
