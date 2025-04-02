import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { fetchDetailedGameStatistics, DetailedGameStatistics } from '../../lib/api';
import { AlertTriangle, Loader2, BarChart3 } from 'lucide-react';
import { Progress } from '../ui/progress';

export default function DetailedGameStats() {
  const [stats, setStats] = useState<DetailedGameStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadDetailedStats() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDetailedGameStatistics();
        setStats(data);
      } catch (err) {
        console.error('Failed to load detailed game statistics:', err);
        setError('Failed to load detailed statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadDetailedStats();
  }, []);
  
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Detailed Game Statistics
        </CardTitle>
        <CardDescription>Player completion rates and game tracking</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 p-4 rounded text-center text-destructive text-sm">
            {error}
          </div>
        ) : stats ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Total Games</div>
                <div className="text-2xl font-bold">{stats.totalGames}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Completion Rate</div>
                <div className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Completed: {stats.completedGames}</span>
                <span>Uncompleted: {stats.uncompletedGames}</span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>
            
            <div className="text-xs text-muted-foreground mt-4">
              Last updated: {formatDate(stats.lastUpdated)}
            </div>
          </div>
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            No statistics available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}