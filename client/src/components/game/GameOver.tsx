import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { ArrowUpCircle, ArrowDownCircle, RefreshCw } from "lucide-react";

export default function GameOver() {
  const { gameState, restartGame } = useGlobalGameState();
  const { playSuccess } = useAudio();
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    // Play success sound on game over screen
    playSuccess();
    
    // Animate in the results after a short delay
    const timer = setTimeout(() => {
      setShowResults(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [playSuccess]);
  
  // Calculate final score and profit
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
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
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
                ${finalProfit.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Final Profit
              </p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold">
                  ${gameState.cash.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Final Cash</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  ${gameState.debt.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Final Debt</p>
              </div>
            </div>
            
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
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={restartGame} 
            className="w-full" 
            variant="default"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
