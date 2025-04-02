import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { Badge } from "../ui/badge";
import { Shirt, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";

interface InventoryProps {
  onSellClick: (itemId: string) => void;
}

export default function Inventory({ onSellClick }: InventoryProps) {
  const { gameState } = useGlobalGameState();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate capacity usage
  const totalItems = gameState.inventory.reduce((sum, item) => sum + item.quantity, 0);
  const capacityPercentage = (totalItems / gameState.maxInventorySpace) * 100;
  
  // Sort inventory by quantity (highest first)
  const sortedInventory = [...gameState.inventory]
    .sort((a, b) => b.quantity - a.quantity)
    .filter(item => item.quantity > 0);
    
  // Filter items to display based on expanded state
  const displayItems = isExpanded 
    ? sortedInventory 
    : sortedInventory.slice(0, 3);
  
  return (
    <Card className="mb-2 overflow-hidden">
      <CardHeader className="py-2 px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xs md:text-sm">
            <Shirt className="mr-1 h-3 w-3 md:h-4 md:w-4" />
            Trenchcoat
          </CardTitle>
          <Badge variant={capacityPercentage > 90 ? "destructive" : "outline"} className="text-[10px] h-5 ml-auto">
            {totalItems}/{gameState.maxInventorySpace}
          </Badge>
        </div>
        <Progress 
          value={capacityPercentage} 
          className={`h-1.5 mt-2 ${
            capacityPercentage > 90 
              ? "[&>div]:bg-red-500" 
              : capacityPercentage > 70 
              ? "[&>div]:bg-amber-500" 
              : ""
          }`}
        />
      </CardHeader>
      <CardContent className="py-0 px-3 pb-2">
        {sortedInventory.length === 0 ? (
          <div className="text-center py-1 text-muted-foreground text-xs">
            Your trenchcoat is empty
          </div>
        ) : (
          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
            {displayItems.map((item) => {
              // Get item definition to check price trends
              const itemDefinition = gameState.items.find(i => i.id === item.id);
              const currentPrice = gameState.currentPrices[item.id] || 0;
              
              // Determine if price is trending up or down compared to purchase price
              const priceDiff = currentPrice - item.avgPurchasePrice;
              const priceChange = priceDiff !== 0 ? (priceDiff / item.avgPurchasePrice) * 100 : 0;
              
              return (
                <div key={item.id} className="flex items-center justify-between py-1 border-b border-border/40 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className="font-medium text-xs truncate">{itemDefinition?.name}</span>
                      {priceDiff > 0 ? (
                        <TrendingUp className="ml-1 h-3 w-3 text-green-500 flex-shrink-0" />
                      ) : priceDiff < 0 ? (
                        <TrendingDown className="ml-1 h-3 w-3 text-red-500 flex-shrink-0" />
                      ) : null}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center">
                      <span className="truncate">Qty: {item.quantity}</span>
                      <span className="mx-1 inline-block">•</span>
                      <span className="truncate">
                        ${item.avgPurchasePrice}
                      </span>
                      {priceChange !== 0 && (
                        <span className={`truncate ${priceChange > 0 ? "text-green-500" : "text-red-500"}`}>
                          {" "}({priceChange > 0 ? "+" : ""}{priceChange.toFixed(0)}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-6 text-[10px] px-2 ml-1"
                    onClick={() => onSellClick(item.id)}
                  >
                    Sell
                  </Button>
                </div>
              );
            })}
            
            {sortedInventory.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-5 text-[10px] mt-1"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show Less" : `+${sortedInventory.length - 3} More`}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
