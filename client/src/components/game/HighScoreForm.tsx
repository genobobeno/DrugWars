import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { submitHighScore, DailySnapshot } from '../../lib/api';
import { Transaction, GameState } from '../../types/game';
import { Check, Crown, X, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Separator } from '../ui/separator';
import CharacterStats from './CharacterStats';

interface HighScoreFormProps {
  gameState: GameState;
  onSubmitted: () => void;
  onCancel: () => void;
}

export default function HighScoreForm({ gameState, onSubmitted, onCancel }: HighScoreFormProps) {
  const [playerName, setPlayerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  // Calculate final score (cash + bank - debt)
  const finalScore = gameState.cash + gameState.bank - gameState.debt;
  
  // Prepare daily snapshots data
  const prepareSnapshots = (): DailySnapshot[] => {
    // This would ideally come from a history of daily states
    // For now, create a simplified version based on transaction history
    const snapshots: DailySnapshot[] = [];
    
    const days = new Set<number>();
    gameState.transactionHistory.forEach((t: Transaction) => days.add(t.day));
    
    // Ensure we always have day 1 and the current day
    days.add(1);
    days.add(gameState.currentDay);
    
    // Sort days
    const sortedDays = Array.from(days).sort((a, b) => a - b);
    
    // For each day, calculate the net worth up to that point
    sortedDays.forEach(day => {
      // Calculate state at this day based on transactions
      let cash = gameState.startingCash;
      let bank = 0;
      let debt = 5500; // Starting debt
      
      // Apply all transactions up to this day
      gameState.transactionHistory
        .filter((t: Transaction) => t.day <= day)
        .forEach((t: Transaction) => {
          if (t.type === 'buy') {
            cash -= t.total;
          } else if (t.type === 'sell') {
            cash += t.total;
          }
          // Note: This is simplified and doesn't account for banking/debt transactions
        });
      
      // Calculate net worth
      const netWorth = cash + bank - debt;
      
      snapshots.push({
        day,
        cash,
        bank,
        debt,
        netWorth
      });
    });
    
    return snapshots;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name to save your score');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const snapshots = prepareSnapshots();
      
      await submitHighScore({
        playerName: playerName.trim(),
        finalScore,
        cashBalance: gameState.cash,
        bankBalance: gameState.bank,
        debt: gameState.debt,
        dayCompleted: gameState.currentDay,
        transactionHistory: gameState.transactionHistory,
        dailySnapshots: snapshots
      });
      
      setSubmitted(true);
      setTimeout(() => {
        onSubmitted();
      }, 2000);
      
    } catch (err) {
      console.error('Failed to submit high score:', err);
      setError('Failed to submit your score. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Game Over - Save Your Score
        </CardTitle>
        <CardDescription>
          Your 30-day drug empire journey has ended. Save your score to the leaderboard!
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {submitted ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center rounded-full p-2 bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium">Score Submitted!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your score has been saved to the leaderboard.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Final Score:</span>
                  <span className={`text-lg font-bold ${finalScore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${finalScore.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cash:</span>
                  <span className="text-sm text-green-600">${gameState.cash.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bank:</span>
                  <span className="text-sm">${gameState.bank.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Debt:</span>
                  <span className="text-sm text-red-600">${gameState.debt.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Days Completed:</span>
                  <span className="text-sm">{gameState.currentDay}/30</span>
                </div>
              </div>
              
              {/* Simple summary chart */}
              <div className="h-[140px] mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={prepareSnapshots()}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <XAxis dataKey="day" hide />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Net Worth']}
                      labelFormatter={(day) => `Day ${day}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="netWorth" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Character Stats */}
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium mb-2">Character Progression</h3>
              <CharacterStats gameState={gameState} mini={true} />
            </div>
            
            <Separator className="my-4" />
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="player-name">Enter Your Name</Label>
                  <Input
                    id="player-name"
                    placeholder="Your Name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={100}
                    required
                  />
                </div>
                
                {error && (
                  <div className="flex items-start gap-2 text-sm bg-red-500/10 p-2 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-red-500">{error}</p>
                  </div>
                )}
              </div>
            </form>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {!submitted && (
          <>
            <Button variant="outline" onClick={onCancel} disabled={submitting}>
              Skip
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Score'}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}