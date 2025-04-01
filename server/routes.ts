import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Game server is running' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
