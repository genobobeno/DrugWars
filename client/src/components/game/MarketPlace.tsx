import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { Badge } from "../ui/badge";
import { ShoppingCart, Banknote, AlertCircle, BadgeInfo, AlertTriangle, TrendingUp } from "lucide-react";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { isDrugAvailable, getDrugEventDescription } from "../../lib/priceGenerator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { InventoryItem, MarketItem } from "../../types/game";
import { drugs } from "../../lib/gameData";

interface MarketPlaceProps {
  selectedItemToSell: string | null;
  clearSelectedItem: () => void;
}

export default function MarketPlace({ selectedItemToSell, clearSelectedItem }: MarketPlaceProps) {
  const { gameState, buyItem, sellItem } = useGlobalGameState();
  const { playHit, playSuccess } = useAudio();
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [drugEvents, setDrugEvents] = useState<Record<string, string | null>>({});
  
  // Initialize drug events when currentPrices change (which happens when moving to a new day/location)
  useEffect(() => {
    const events: Record<string, string | null> = {};
    drugs.forEach(drug => {
      events[drug.id] = getDrugEventDescription(drug.id);
    });
    setDrugEvents(events);
  }, [gameState.currentPrices]);
  
  // State for sarcastic prompt
  const [showNotAvailablePrompt, setShowNotAvailablePrompt] = useState(false);
  const [notAvailableDrugName, setNotAvailableDrugName] = useState('');
  
  // Update inventory item when selected from outside
  useEffect(() => {
    if (selectedItemToSell) {
      const item = gameState.inventory.find(item => item.id === selectedItemToSell);
      if (item && item.quantity > 0) {
        const marketItem = gameState.items.find(i => i.id === item.id);
        
        // Check if the drug is available in the current market
        const isDrugAvailableInMarket = isDrugAvailable(item.id, gameState.currentPrices);
        
        if (marketItem && isDrugAvailableInMarket) {
          // Drug is available in the market, show normal selling dialog
          setSelectedInventoryItem(item);
          setSelectedItem(marketItem);
          setTransactionType('sell');
          // Set quantity to maximum available quantity
          setQuantity(item.quantity);
        } else {
          // Drug not available in the market, show sarcastic prompt
          const drugName = gameState.items.find(i => i.id === item.id)?.name || 'this drug';
          setNotAvailableDrugName(drugName);
          setShowNotAvailablePrompt(true);
          // Clear the selected item so it doesn't trigger the main dialog
          clearSelectedItem();
        }
      }
    }
  }, [selectedItemToSell, gameState.inventory, gameState.items, gameState.currentPrices, clearSelectedItem]);
  
  // Filter available drugs
  // Check if player has encountered the Mad Scientist NPC to introduce experimental drug
  const hasMetMadScientist = gameState.eventHistory.some(event => 
    event.npc?.id === "mad_scientist"
  );

  // Filter available drugs - hide experimental drug until player meets Mad Scientist
  const availableDrugs = gameState.items.filter(item => 
    isDrugAvailable(item.id, gameState.currentPrices) && 
    (item.id !== "experimental" || hasMetMadScientist)
  );
  
  // Handle item selection for buying
  const handleSelectItem = (item: MarketItem) => {
    // Check if this is the experimental drug and player hasn't met the Mad Scientist
    if (item.id === "experimental" && !hasMetMadScientist) {
      return; // Shouldn't happen due to filtering, but an extra safety check
    }
    
    setSelectedItem(item);
    setSelectedInventoryItem(null);
    setTransactionType('buy');
    
    // Calculate the maximum quantity the player can buy
    const price = gameState.currentPrices[item.id] || 0;
    const maxAffordable = Math.floor(gameState.cash / price);
    const spaceLeft = gameState.maxInventorySpace - gameState.inventory.reduce((sum, item) => sum + item.quantity, 0);
    const maxQuantity = Math.min(maxAffordable, spaceLeft);
    
    // Set quantity to maximum available (if at least 1)
    setQuantity(Math.max(1, maxQuantity));
    setErrorMessage(null);
    playHit();
  };
  
  // Calculate total cost/value
  const calculateTotal = () => {
    if (!selectedItem) return 0;
    
    const price = gameState.currentPrices[selectedItem.id] || 0;
    return price * quantity;
  };
  
  // Handle transaction (buy or sell)
  const handleTransaction = () => {
    if (!selectedItem) return;
    
    // Extra safety check for experimental drug
    if (selectedItem.id === "experimental" && !hasMetMadScientist) {
      setErrorMessage("You haven't discovered this drug yet");
      return;
    }
    
    try {
      if (transactionType === 'buy') {
        // Check if player has enough cash
        const total = calculateTotal();
        if (total > gameState.cash) {
          setErrorMessage("You don't have enough cash for this purchase");
          return;
        }
        
        // Check if player has enough inventory space
        if (quantity + gameState.inventory.reduce((sum, item) => sum + item.quantity, 0) > gameState.maxInventorySpace) {
          setErrorMessage("You don't have enough inventory space");
          return;
        }
        
        // Buy the item
        buyItem(selectedItem.id, quantity, gameState.currentPrices[selectedItem.id] || 0);
        playSuccess();
      } else {
        // Check if player has enough of this item
        const inventoryItem = gameState.inventory.find(item => item.id === selectedItem.id);
        if (!inventoryItem || inventoryItem.quantity < quantity) {
          setErrorMessage("You don't have enough of this item to sell");
          return;
        }
        
        // Sell the item
        sellItem(selectedItem.id, quantity, gameState.currentPrices[selectedItem.id] || 0);
        playSuccess();
      }
      
      // Reset selection
      setSelectedItem(null);
      setSelectedInventoryItem(null);
      setQuantity(1);
      setErrorMessage(null);
      clearSelectedItem();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    }
  };
  
  // Get max quantity for current transaction
  const getMaxQuantity = () => {
    if (!selectedItem) return 1;
    
    if (transactionType === 'buy') {
      const maxAffordable = Math.floor(gameState.cash / (gameState.currentPrices[selectedItem.id] || 1));
      const spaceLeft = gameState.maxInventorySpace - gameState.inventory.reduce((sum, item) => sum + item.quantity, 0);
      return Math.min(maxAffordable, spaceLeft);
    } else {
      const inventoryItem = gameState.inventory.find(item => item.id === selectedItem.id);
      return inventoryItem ? inventoryItem.quantity : 0;
    }
  };
  
  // Check if a price is exceptionally high or low compared to base price
  const getPriceIndicator = (item: MarketItem, price: number) => {
    const drug = drugs.find(d => d.id === item.id);
    if (!drug) return null;
    
    const avgNormalPrice = (drug.noEventParameters[0] + drug.noEventParameters[1]) / 2;
    
    if (price < avgNormalPrice * 0.5) {
      return { type: 'low', text: 'Cheap!' };
    } else if (price > avgNormalPrice * 1.5) {
      return { type: 'high', text: 'Expensive!' };
    }
    return null;
  };
  
  return (
    <>
      {/* Sarcastic Prompt for Unavailable Drugs */}
      <Dialog
        open={showNotAvailablePrompt}
        onOpenChange={(open) => {
          if (!open) {
            setShowNotAvailablePrompt(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Umm... Are You Serious?
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 text-base">
            <p>Do you see <strong>{notAvailableDrugName}</strong> anywhere in this market?</p>
            <p className="mt-2 text-sm text-muted-foreground">
              You can only sell drugs that are currently available in this borough. Try traveling somewhere else, or wait for the market to change.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setShowNotAvailablePrompt(false)}
            >
              My Bad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compact Drug Market Panel */}
      <Card className="mb-2">
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-sm">
              <Banknote className="mr-1 h-4 w-4" />
              {gameState.currentBorough?.name} Drug Market
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="py-0">
          <div>
            <table className="w-full text-sm">
              <thead className="border-b bg-background z-10">
                <tr>
                  <th className="text-left py-1 font-medium text-xs">Drug</th>
                  <th className="text-right py-1 font-medium text-xs">Price</th>
                  <th className="text-right py-1 font-medium text-xs w-16">Transact</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {availableDrugs.map((item) => {
                  const price = gameState.currentPrices[item.id] || 0;
                  const inventoryItem = gameState.inventory.find(i => i.id === item.id);
                  const inInventory = inventoryItem && inventoryItem.quantity > 0;
                  const priceIndicator = getPriceIndicator(item, price);
                  const hasEvent = drugEvents[item.id];
                  
                  return (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-xs">{item.name}</span>
                          {item.id === "experimental" && (
                            <Badge variant="default" className="text-[8px] h-4 px-1 bg-purple-500 hover:bg-purple-500">UNSTABLE</Badge>
                          )}
                          {hasEvent && (
                            <Badge variant="destructive" className="text-[8px] h-4 px-1">HOT!</Badge>
                          )}
                          {priceIndicator && (
                            <Badge 
                              variant={priceIndicator.type === 'low' ? 'secondary' : 'outline'} 
                              className="text-[8px] h-4 px-1"
                            >
                              {priceIndicator.text}
                            </Badge>
                          )}
                          {inInventory && (
                            <span className="text-[8px] text-muted-foreground">
                              (Own: {inventoryItem?.quantity})
                            </span>
                          )}
                        </div>
                        {hasEvent && (
                          <p className="text-[8px] text-red-500 line-clamp-1 pr-2">{hasEvent}</p>
                        )}
                      </td>
                      <td className="py-1 text-right font-semibold">
                        <div className="flex items-center justify-end gap-1">
                          {priceIndicator?.type === 'low' && <TrendingUp className="h-2 w-2 text-green-500" />}
                          {priceIndicator?.type === 'high' && <AlertTriangle className="h-2 w-2 text-red-500" />}
                          ${price.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-1 text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-5 text-[10px] px-1.5"
                          onClick={() => handleSelectItem(item)}
                        >
                          Buy
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                
                {availableDrugs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground text-xs">
                      No drugs available in this location today.<br />
                      Try traveling to another borough.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Item Transaction Dialog */}
      <Dialog 
        open={!!selectedItem} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null);
            setSelectedInventoryItem(null);
            setQuantity(1);
            setErrorMessage(null);
            clearSelectedItem();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {transactionType === 'buy' ? 'Buy' : 'Sell'} {selectedItem?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {selectedItem && drugEvents[selectedItem.id] && (
              <div className="bg-red-500/10 p-2 rounded text-sm border border-red-200">
                <strong className="text-red-600">ALERT:</strong> {drugEvents[selectedItem.id]}
              </div>
            )}
            
            {selectedItem && selectedItem.id === "experimental" && (
              <div className="bg-purple-500/10 p-2 rounded text-sm border border-purple-200">
                <strong className="text-purple-600">WARNING:</strong> This experimental drug has extremely volatile pricing. The value could skyrocket or plummet overnight. High risk, high reward!
              </div>
            )}
            
            <div className="flex justify-between">
              <span>Price Per Unit:</span>
              <span className="font-medium">${gameState.currentPrices[selectedItem?.id || ''] || 0}</span>
            </div>
            
            {transactionType === 'sell' && selectedInventoryItem && (
              <div className="flex justify-between text-sm">
                <span>Average Purchase Price:</span>
                <span className="font-medium">${selectedInventoryItem.avgPurchasePrice}</span>
              </div>
            )}
            
            <Separator />
            
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="quantity-slider" className="text-sm font-medium">
                  Quantity: {quantity}
                </label>
                <span className="text-sm text-muted-foreground">
                  Max: {getMaxQuantity()}
                </span>
              </div>
              <Slider
                id="quantity-slider"
                value={[quantity]}
                min={1}
                max={Math.max(1, getMaxQuantity())}
                step={1}
                onValueChange={(values) => setQuantity(values[0])}
                disabled={getMaxQuantity() <= 0}
              />
            </div>
            
            <div className="bg-muted/30 rounded-md p-3">
              <div className="flex justify-between text-sm mb-2">
                <span>Total {transactionType === 'buy' ? 'Cost' : 'Value'}:</span>
                <span className="font-bold">${calculateTotal().toLocaleString()}</span>
              </div>
              
              {transactionType === 'buy' && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Your Cash:</span>
                  <span>${gameState.cash.toLocaleString()}</span>
                </div>
              )}
              
              {transactionType === 'sell' && selectedInventoryItem && (
                <div className="flex justify-between text-xs">
                  <span>Profit/Loss:</span>
                  <span className={
                    calculateTotal() - (selectedInventoryItem.avgPurchasePrice * quantity) > 0
                      ? "text-green-500"
                      : calculateTotal() - (selectedInventoryItem.avgPurchasePrice * quantity) < 0
                      ? "text-red-500"
                      : ""
                  }>
                    ${(calculateTotal() - (selectedInventoryItem.avgPurchasePrice * quantity)).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            
            {transactionType === 'buy' && (
              <div className="flex items-start gap-2 text-sm">
                <BadgeInfo className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Prices change depending on location and special events. Buy low and sell high to maximize profits!
                </p>
              </div>
            )}
            
            {errorMessage && (
              <div className="flex items-start gap-2 text-sm bg-red-500/10 p-2 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-500">{errorMessage}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedItem(null);
              setSelectedInventoryItem(null);
              clearSelectedItem();
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleTransaction}
              disabled={quantity <= 0 || getMaxQuantity() <= 0}
            >
              {transactionType === 'buy' ? (
                <ShoppingCart className="mr-2 h-4 w-4" />
              ) : (
                <Banknote className="mr-2 h-4 w-4" />
              )}
              {transactionType === 'buy' ? 'Buy' : 'Sell'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
