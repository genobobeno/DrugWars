import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Shield, Heart, Brain, TrendingUp, Zap, DollarSign } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { GameState } from '../../types/game';
import { cn } from '../../lib/utils';

interface CharacterStatsProps {
  gameState: GameState;
  mini?: boolean;
}

export default function CharacterStats({ gameState, mini = false }: CharacterStatsProps) {
  // Calculate derived stats based on game state
  const cashRatio = Math.min(gameState.cash / 10000, 1); // Cash progress (max at $10k)
  const debtRatio = Math.max(0, 1 - gameState.debt / 10000); // Debt progress (lower is better)
  const inventoryRatio = gameState.inventory.reduce((sum, item) => sum + item.quantity, 0) / gameState.maxInventorySpace;
  const dayProgress = gameState.currentDay / gameState.totalDays;
  
  // Calculated skills based on game metrics
  const calculateTraderLevel = () => {
    const totalTransactions = gameState.transactionHistory.length;
    if (totalTransactions > 100) return 5;
    if (totalTransactions > 50) return 4;
    if (totalTransactions > 25) return 3;
    if (totalTransactions > 10) return 2;
    return 1;
  };
  
  const calculateStreetSmarts = () => {
    const boroughsVisited = gameState.boroughVisits.filter(b => b.count > 0).length;
    const eventsSurvived = gameState.eventHistory.length;
    const score = boroughsVisited * 5 + eventsSurvived * 2;
    
    if (score > 50) return 5;
    if (score > 30) return 4;
    if (score > 20) return 3;
    if (score > 10) return 2;
    return 1;
  };
  
  const calculateNetWorthLevel = () => {
    const netWorth = gameState.cash + gameState.bank - gameState.debt;
    if (netWorth > 50000) return 5;
    if (netWorth > 20000) return 4;
    if (netWorth > 10000) return 3;
    if (netWorth > 5000) return 2;
    return 1;
  };
  
  const calculateSurvivalRating = () => {
    const healthFactor = gameState.health / 100;
    const dayFactor = gameState.currentDay / gameState.totalDays;
    const gunsFactor = Math.min(gameState.guns / 5, 1);
    
    const score = (healthFactor * 0.4 + dayFactor * 0.4 + gunsFactor * 0.2) * 5;
    return Math.max(1, Math.min(5, Math.ceil(score)));
  };
  
  // Stats to display
  const traderLevel = calculateTraderLevel();
  const streetSmarts = calculateStreetSmarts();
  const netWorthLevel = calculateNetWorthLevel();
  const survivalRating = calculateSurvivalRating();
  
  const getStatColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-gray-400';
      case 2: return 'bg-green-400';
      case 3: return 'bg-blue-400';
      case 4: return 'bg-purple-400';
      case 5: return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };
  
  const getStatLabel = (level: number) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Novice';
      case 3: return 'Skilled';
      case 4: return 'Expert';
      case 5: return 'Master';
      default: return 'Rookie';
    }
  };
  
  const renderStatBadge = (level: number, label: string) => (
    <Badge variant="outline" className={cn("text-xs font-semibold", getStatColor(level))}>
      {label} {getStatLabel(level)}
    </Badge>
  );
  
  // Compact display for mini mode
  if (mini) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <Progress value={traderLevel * 20} className="h-2 w-12" />
        </div>
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-purple-500" />
          <Progress value={streetSmarts * 20} className="h-2 w-12" />
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-500" />
          <Progress value={netWorthLevel * 20} className="h-2 w-12" />
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-red-500" />
          <Progress value={survivalRating * 20} className="h-2 w-12" />
        </div>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Character Progression
        </CardTitle>
        <CardDescription>
          Your hustler skills and statistics
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Primary resource meters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Health</span>
                </div>
                <span className="text-sm">{gameState.health}%</span>
              </div>
              <Progress value={gameState.health} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Guns</span>
                </div>
                <span className="text-sm">{gameState.guns}</span>
              </div>
              <Progress value={Math.min(gameState.guns * 20, 100)} className="h-2" />
            </div>
          </div>
          
          {/* Progression meters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Cash</span>
                </div>
                <span className="text-sm">${gameState.cash.toLocaleString()}</span>
              </div>
              <Progress value={cashRatio * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Debt Repayment</span>
                </div>
                <span className="text-sm">${gameState.debt.toLocaleString()}</span>
              </div>
              <Progress value={debtRatio * 100} className="h-2" />
            </div>
          </div>
          
          {/* Skill ratings */}
          <div className="pt-2 border-t">
            <h4 className="text-sm font-medium mb-3">Hustler Skills</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          <span className="text-xs font-medium">Trader</span>
                        </div>
                        <span className="text-xs">{traderLevel}/5</span>
                      </div>
                      <Progress value={traderLevel * 20} className="h-1.5" />
                      <div className="text-right text-xs text-muted-foreground">
                        {renderStatBadge(traderLevel, "Trader")}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Based on your trading history and profit margins</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <Brain className="h-4 w-4 text-purple-500" />
                          <span className="text-xs font-medium">Street Smarts</span>
                        </div>
                        <span className="text-xs">{streetSmarts}/5</span>
                      </div>
                      <Progress value={streetSmarts * 20} className="h-1.5" />
                      <div className="text-right text-xs text-muted-foreground">
                        {renderStatBadge(streetSmarts, "Street")}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Based on boroughs visited and events survived</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="text-xs font-medium">Net Worth</span>
                        </div>
                        <span className="text-xs">{netWorthLevel}/5</span>
                      </div>
                      <Progress value={netWorthLevel * 20} className="h-1.5" />
                      <div className="text-right text-xs text-muted-foreground">
                        {renderStatBadge(netWorthLevel, "Worth")}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Based on your total cash, bank balance, and debt</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <Shield className="h-4 w-4 text-red-500" />
                          <span className="text-xs font-medium">Survival</span>
                        </div>
                        <span className="text-xs">{survivalRating}/5</span>
                      </div>
                      <Progress value={survivalRating * 20} className="h-1.5" />
                      <div className="text-right text-xs text-muted-foreground">
                        {renderStatBadge(survivalRating, "Survival")}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Based on health, days survived, and protection</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Game progress indicator */}
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium">Game Progress</span>
              <span className="text-xs">{gameState.currentDay}/{gameState.totalDays} Days</span>
            </div>
            <Progress value={dayProgress * 100} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}