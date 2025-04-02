import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { ArrowUpCircle, ArrowDownCircle, RefreshCw, Trophy, ChevronRight } from "lucide-react";
import HighScoreForm from "./HighScoreForm";
import HighScoreTable from "./HighScoreTable";
import GameProgressChart from "./GameProgressChart";
import GameStatsFooter from "./GameStatsFooter";
import { recordGameStarted } from "../../lib/api";
import { DailySnapshot } from "../../lib/api";

// Calculate compound daily growth rate (CDGR)
function calculateCompoundGrowthRate(snapshots: DailySnapshot[]): number {
  if (snapshots.length < 2) return 0;
  
  // Sort by day to ensure chronological order
  const sortedSnapshots = [...snapshots].sort((a, b) => a.day - b.day);
  
  // Get initial and final net worth values
  const initialValue = sortedSnapshots[0].netWorth;
  const finalValue = sortedSnapshots[sortedSnapshots.length - 1].netWorth;
  
  // If initial value is zero or negative, return a flat rate
  if (initialValue <= 0) return 0;
  
  // Number of days (periods)
  const periods = sortedSnapshots.length - 1;
  
  // Calculate compound daily growth rate: (finalValue/initialValue)^(1/periods) - 1
  const rate = Math.pow(finalValue / initialValue, 1 / periods) - 1;
  
  // Convert to percentage
  return rate * 100;
}

export default function GameOver() {
  const { gameState, restartGame } = useGlobalGameState();
  const { playSuccess } = useAudio();
  const [showResults, setShowResults] = useState(false);
  const [showHighScoreForm, setShowHighScoreForm] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [snapshots, setSnapshots] = useState<DailySnapshot[]>([]);
  
  useEffect(() => {
    // Play success sound on game over screen
    playSuccess();
    
    // Animate in the results after a short delay
    const timer = setTimeout(() => {
      setShowResults(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [playSuccess]);
  
  // Generate daily snapshots for the game progress chart
  useEffect(() => {
    // Generate snapshots from game history - in a real implementation, these would be actual daily snapshots
    // For now, recreate them from transaction history
    const days = new Set<number>();
    gameState.transactionHistory.forEach(t => days.add(t.day));
    
    // Ensure we have day 1 and the final day
    days.add(1);
    days.add(gameState.currentDay);
    
    const sortedDays = Array.from(days).sort((a, b) => a - b);
    
    const newSnapshots = sortedDays.map(day => {
      // Calculate state at this day based on transactions
      let cash = gameState.startingCash;
      let bank = 0;
      let debt = 5500; // Starting debt
      
      // Apply all transactions up to this day
      gameState.transactionHistory
        .filter(t => t.day <= day)
        .forEach(t => {
          if (t.type === 'buy') {
            cash -= t.total;
          } else if (t.type === 'sell') {
            cash += t.total;
          }
          // This is simplified and doesn't account for bank/debt transactions
        });
      
      // Apply approximate interest for bank and debt
      if (day > 1) {
        bank = bank * Math.pow(1.05, day-1); // 5% daily interest
        debt = debt * Math.pow(1.1, day-1);  // 10% daily interest
      }
      
      return {
        day,
        cash,
        bank,
        debt,
        netWorth: cash + bank - debt
      };
    });
    
    setSnapshots(newSnapshots);
  }, [gameState]);
  
  // Calculate final score and profit
  const finalScore = gameState.cash + gameState.bank - gameState.debt;
  const finalProfit = gameState.cash - gameState.startingCash - gameState.debt;
  const isWinner = finalProfit > 0;
  
  // Generate game summary
  const topItem = gameState.transactionHistory.reduce<{item: string, count: number} | null>((acc, tx) => {
    if (tx.type === 'buy' && (!acc || tx.quantity > acc.count)) {
      return {item: tx.itemName, count: tx.quantity};
    }
    return acc;
  }, null);
  
  const mostVisitedBorough = gameState.boroughVisits.reduce<{id: string, count: number}>((acc, visit) => {
    if (acc.count < visit.count) {
      return visit;
    }
    return acc;
  }, {id: '', count: 0});
  
  const borough = gameState.boroughs.find(b => b.id === mostVisitedBorough.id);
  
  const handleSaveScore = () => {
    setShowHighScoreForm(true);
  };
  
  const handleViewLeaderboard = () => {
    setShowLeaderboard(true);
  };
  
  const handleRestart = () => {
    // Record that a new game is being started
    recordGameStarted().catch(err => {
      console.error('Failed to record game start:', err);
    });
    
    // Restart the game
    restartGame();
  };
  
  if (showLeaderboard) {
    return (
      <div className="flex flex-col min-h-screen bg-background p-4">
        <div className="container max-w-2xl mx-auto py-6 space-y-6 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">High Scores</h2>
            <Button variant="outline" onClick={() => setShowLeaderboard(false)}>
              Back
            </Button>
          </div>
          
          <HighScoreTable />
          
          <div className="mt-6 border rounded-lg p-4 bg-card">
            <h3 className="font-medium mb-3">Wealth Progression</h3>
            <div className="h-[180px] w-full">
              <GameProgressChart snapshots={snapshots} />
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button onClick={handleRestart}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start New Game
            </Button>
          </div>
        </div>
        
        <GameStatsFooter />
      </div>
    );
  }
  
  if (showHighScoreForm) {
    return (
      <div className="flex flex-col min-h-screen bg-background p-4">
        <div className="container max-w-2xl mx-auto py-6 flex-1">
          <HighScoreForm 
            gameState={gameState} 
            onSubmitted={() => setShowLeaderboard(true)}
            onCancel={() => setShowLeaderboard(true)}
          />
        </div>
        
        <GameStatsFooter />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center justify-center p-4 flex-1">
        <Card className={`w-full max-w-md transition-all duration-700 ${showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <CardHeader className={`${isWinner ? 'bg-green-500/10' : 'bg-red-500/10'} rounded-t-lg`}>
            <CardTitle className="text-center text-2xl flex justify-center items-center gap-2">
              {isWinner ? (
                <>
                  <ArrowUpCircle className="h-6 w-6 text-green-500" />
                  Game Over - You Won!
                </>
              ) : (
                <>
                  <ArrowDownCircle className="h-6 w-6 text-red-500" />
                  Game Over - You Lost
                </>
              )}
            </CardTitle>
            <CardDescription className="text-center">
              You survived {gameState.currentDay} days in NYC
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold">
                  ${finalScore.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Final Score (Cash + Bank - Debt)
                </p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-green-600">
                    ${gameState.cash.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Cash</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    ${gameState.bank.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Bank</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-red-600">
                    ${gameState.debt.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Debt</p>
                </div>
              </div>
              
              {/* Game chart moved to after buttons */}
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">Game Statistics</h3>
                
                <div className="bg-muted/30 rounded-md p-3 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Items Bought:</span>
                    <span>{gameState.transactionHistory.filter(t => t.type === 'buy').reduce((acc, t) => acc + t.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items Sold:</span>
                    <span>{gameState.transactionHistory.filter(t => t.type === 'sell').reduce((acc, t) => acc + t.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Most Bought Item:</span>
                    <span>{topItem?.item || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Favorite Borough:</span>
                    <span>{borough?.name || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Random Events:</span>
                    <span>{gameState.eventHistory.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compound Daily Growth:</span>
                    <span>{snapshots.length > 1 ? 
                      `${calculateCompoundGrowthRate(snapshots).toFixed(2)}%` : 
                      'N/A'}</span>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              onClick={handleSaveScore} 
              className="w-full" 
              variant="default"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Save High Score
            </Button>
            
            <div className="flex gap-2 w-full">
              <Button 
                onClick={handleViewLeaderboard}
                className="flex-1" 
                variant="outline"
              >
                View Leaderboard
              </Button>
              
              <Button 
                onClick={handleRestart}
                className="flex-1" 
                variant="outline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                New Game
              </Button>
            </div>
            
            {/* Game progress chart below buttons */}
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-3">Wealth Progression</h3>
              <div className="h-[180px] w-full">
                <GameProgressChart snapshots={snapshots} />
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <GameStatsFooter />
    </div>
  );
}
