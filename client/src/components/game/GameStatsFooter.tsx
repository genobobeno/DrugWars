import React, { useState, useEffect } from 'react';
import { fetchGameStatistics, GameStatistics } from '../../lib/api';
import { Separator } from '../ui/separator';
import { Loader2, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import DetailedGameStats from './DetailedGameStats';

export default function GameStatsFooter() {
  const [stats, setStats] = useState<GameStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await fetchGameStatistics();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load game statistics', err);
        setError('Failed to load game statistics');
      } finally {
        setLoading(false);
      }
    }
    
    loadStats();
  }, []);
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  return (
    <footer className="px-4 py-2 border-t mt-6">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground gap-2">
        <div>
          <span className="font-medium">Drug Empire</span> • NYC Hustle Simulator
        </div>
        
        <Separator orientation="vertical" className="h-4 mx-2 hidden sm:block" />
        <Separator orientation="horizontal" className="w-full h-px block sm:hidden" />
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Loading stats...
            </span>
          ) : error ? (
            <span>{error}</span>
          ) : stats ? (
            <>
              <span>{stats.totalGamesStarted} Games Started</span>
              <Separator orientation="vertical" className="h-3 hidden sm:block" />
              <Separator orientation="horizontal" className="w-full h-px block sm:hidden" />
              <span>{stats.totalGamesCompleted} Games Completed</span>
              <Separator orientation="vertical" className="h-3 hidden sm:block" />
              <Separator orientation="horizontal" className="w-full h-px block sm:hidden" />
              <span>Last updated: {formatDate(stats.lastUpdated)}</span>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-1" aria-label="View detailed statistics">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <DetailedGameStats />
                </PopoverContent>
              </Popover>
            </>
          ) : null}
        </div>
      </div>
    </footer>
  );
}