import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Banknote, 
  TrendingDown, 
  TrendingUp, 
  Heart, 
  Compass, 
  BadgeDollarSign 
} from "lucide-react";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";

export default function PlayerStats() {
  const { gameState } = useGlobalGameState();
  const [profitTrend, setProfitTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  
  useEffect(() => {
    // Calculate profit trend based on last few transactions
    const recentTransactions = gameState.transactionHistory.slice(-5);
    
    if (recentTransactions.length < 2) {
      setProfitTrend('neutral');
      return;
    }
    
    const profit = recentTransactions.reduce((total, transaction) => {
      if (transaction.type === 'sell') {
        // Add sale value
        return total + (transaction.price * transaction.quantity);
      } else {
        // Subtract purchase cost
        return total - (transaction.price * transaction.quantity);
      }
    }, 0);
    
    setProfitTrend(profit > 0 ? 'up' : profit < 0 ? 'down' : 'neutral');
  }, [gameState.transactionHistory]);
  
  // Calculate net worth (cash + inventory value - debt)
  const inventoryValue = gameState.inventory.reduce((total, item) => {
    const price = gameState.currentPrices[item.id] || 0;
    return total + (price * item.quantity);
  }, 0);
  
  const netWorth = gameState.cash + inventoryValue - gameState.debt;
  
  // Format values as locale strings
  const cashFormatted = gameState.cash.toLocaleString();
  const debtFormatted = gameState.debt.toLocaleString();
  const inventoryValueFormatted = inventoryValue.toLocaleString();
  const netWorthFormatted = netWorth.toLocaleString();
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {/* Cash */}
          <div className="flex flex-col">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Banknote className="mr-1 h-4 w-4" />
              <span>Cash</span>
            </div>
            <div className="text-xl font-semibold">${cashFormatted}</div>
          </div>
          
          {/* Debt */}
          <div className="flex flex-col">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <BadgeDollarSign className="mr-1 h-4 w-4" />
              <span>Debt</span>
              <Badge variant="outline" className="ml-1 px-1 py-0 text-xs">
                {gameState.debtInterestRate}% daily
              </Badge>
            </div>
            <div className="text-xl font-semibold text-red-500">${debtFormatted}</div>
          </div>
          
          {/* Health */}
          <div className="flex flex-col">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Heart className="mr-1 h-4 w-4" />
              <span>Health</span>
            </div>
            <Progress 
              value={gameState.health} 
              className="h-4 mt-1"
              indicatorColor={
                gameState.health < 25 ? "bg-red-500" : 
                gameState.health < 50 ? "bg-amber-500" : 
                "bg-green-500"
              }
            />
          </div>
          
          {/* Current Location */}
          <div className="flex flex-col">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Compass className="mr-1 h-4 w-4" />
              <span>Location</span>
            </div>
            <div className="font-medium truncate">{gameState.currentBorough?.name || 'Unknown'}</div>
            {profitTrend !== 'neutral' && (
              <div className="flex items-center mt-1 text-xs">
                <span>Profit Trend:</span>
                {profitTrend === 'up' ? (
                  <TrendingUp className="ml-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="ml-1 h-3 w-3 text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Net Worth Section */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Inventory Value</span>
              <span className="font-medium">${inventoryValueFormatted}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-muted-foreground">Net Worth</span>
              <span className={`font-semibold ${netWorth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${netWorthFormatted}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
