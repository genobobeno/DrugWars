import { apiRequest, getQueryFn } from './queryClient';

// Types for API responses
export interface HighScore {
  id: number;
  playerName: string;
  finalScore: number;
  cashBalance: number;
  bankBalance: number;
  debt: number;
  dayCompleted: number;
  dateCreated: string;
}

export interface HighScoresResponse {
  scores: HighScore[];
}

export interface GameStatistics {
  totalGamesStarted: number;
  totalGamesCompleted: number;
  lastUpdated: string;
}

export interface DetailedGameStatistics {
  totalGames: number;
  completedGames: number;
  uncompletedGames: number;
  completionRate: number;
  lastUpdated: string;
}

export interface GameStartResponse {
  success: boolean;
  gameId: number;
}

export interface DailySnapshot {
  day: number;
  cash: number;
  bank: number;
  debt: number;
  netWorth: number;
}

export interface SnapshotsResponse {
  snapshots: DailySnapshot[];
}

export interface ScoreSubmissionResponse {
  success: boolean;
  scoreId: number;
}

export interface SuccessResponse {
  success: boolean;
}

// API Functions
export async function fetchHighScores(): Promise<HighScore[]> {
  const response = await apiRequest<HighScoresResponse>('/api/highscores', {
    method: 'GET',
    on401: 'throw',
  });
  return response.scores;
}

export async function submitHighScore(data: {
  playerName: string;
  finalScore: number;
  cashBalance: number;
  bankBalance: number;
  debt: number;
  dayCompleted: number;
  transactionHistory: any[];
  dailySnapshots: DailySnapshot[];
  gameId?: number;
}): Promise<ScoreSubmissionResponse> {
  return await apiRequest<ScoreSubmissionResponse>('/api/highscores', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    on401: 'throw',
  });
}

export async function fetchGameStatistics(): Promise<GameStatistics> {
  return await apiRequest<GameStatistics>('/api/statistics', {
    method: 'GET',
    on401: 'throw',
  });
}

export async function recordGameStarted(): Promise<GameStartResponse> {
  return await apiRequest<GameStartResponse>('/api/statistics/game-started', {
    method: 'POST',
    on401: 'throw',
  });
}

export async function fetchDetailedGameStatistics(): Promise<DetailedGameStatistics> {
  return await apiRequest<DetailedGameStatistics>('/api/statistics/detailed', {
    method: 'GET',
    on401: 'throw',
  });
}

export async function fetchGameSnapshots(gameId: number): Promise<DailySnapshot[]> {
  const response = await apiRequest<SnapshotsResponse>(`/api/games/${gameId}/snapshots`, {
    method: 'GET',
    on401: 'throw',
  });
  return response.snapshots;
}