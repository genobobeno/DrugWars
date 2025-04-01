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
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Shirt className="mr-2 h-5 w-5" />
          Trenchcoat Space
          <Badge variant="outline" className="ml-auto">
            {totalItems}/{gameState.maxInventorySpace}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress 
          value={capacityPercentage} 
          className={`h-2 mb-4 ${
            capacityPercentage > 90 
              ? "[&>div]:bg-red-500" 
              : capacityPercentage > 70 
              ? "[&>div]:bg-amber-500" 
              : ""
          }`}
        />
        
        {sortedInventory.length === 0 ? (
          <div className="text-center py-2 text-muted-foreground">
            Your trenchcoat is empty
          </div>
        ) : (
          <div className="space-y-2">
            {displayItems.map((item) => {
              // Get item definition to check price trends
              const itemDefinition = gameState.items.find(i => i.id === item.id);
              const currentPrice = gameState.currentPrices[item.id] || 0;
              
              // Determine if price is trending up or down compared to purchase price
              const priceDiff = currentPrice - item.avgPurchasePrice;
              const priceChange = priceDiff !== 0 ? (priceDiff / item.avgPurchasePrice) * 100 : 0;
              
              return (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium">{itemDefinition?.name}</span>
                      {priceDiff > 0 ? (
                        <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                      ) : priceDiff < 0 ? (
                        <TrendingDown className="ml-1 h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span>Qty: {item.quantity}</span>
                      <span className="mx-1">•</span>
                      <span>
                        Avg. bought: ${item.avgPurchasePrice}
                      </span>
                      {priceChange !== 0 && (
                        <span className={priceChange > 0 ? "text-green-500" : "text-red-500"}>
                          {" "}({priceChange > 0 ? "+" : ""}{priceChange.toFixed(0)}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
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
                className="w-full mt-2 text-xs"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show Less" : `Show ${sortedInventory.length - 3} More`}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
