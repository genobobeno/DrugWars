import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { ShoppingCart, Banknote, AlertCircle, BadgeInfo, Search } from "lucide-react";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { InventoryItem, MarketItem } from "../../types/game";

interface MarketPlaceProps {
  selectedItemToSell: string | null;
  clearSelectedItem: () => void;
}

export default function MarketPlace({ selectedItemToSell, clearSelectedItem }: MarketPlaceProps) {
  const { gameState, buyItem, sellItem } = useGlobalGameState();
  const { playHit, playSuccess } = useAudio();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Update inventory item when selected from outside
  useEffect(() => {
    if (selectedItemToSell) {
      const item = gameState.inventory.find(item => item.id === selectedItemToSell);
      if (item && item.quantity > 0) {
        const marketItem = gameState.items.find(i => i.id === item.id);
        if (marketItem) {
          setSelectedInventoryItem(item);
          setSelectedItem(marketItem);
          setTransactionType('sell');
          setQuantity(1);
        }
      }
    }
  }, [selectedItemToSell, gameState.inventory, gameState.items]);
  
  // Filter items based on search query
  const filteredItems = gameState.items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle item selection for buying
  const handleSelectItem = (item: MarketItem) => {
    setSelectedItem(item);
    setSelectedInventoryItem(null);
    setTransactionType('buy');
    setQuantity(1);
    setErrorMessage(null);
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
  
  return (
    <>
      {/* Available Drugs Panel */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Banknote className="mr-2 h-5 w-5" />
            Available Drugs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 font-medium">Drug</th>
                  <th className="text-right py-2 font-medium">Price</th>
                  <th className="text-right py-2 font-medium">In Stock</th>
                  <th className="text-right py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gameState.items.map((item) => {
                  const price = gameState.currentPrices[item.id] || 0;
                  const inventoryItem = gameState.inventory.find(i => i.id === item.id);
                  const inInventory = inventoryItem && inventoryItem.quantity > 0;
                  
                  return (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-right">${price.toLocaleString()}</td>
                      <td className="py-2 text-right">
                        {inInventory ? `${inventoryItem?.quantity}` : '-'}
                      </td>
                      <td className="py-2 text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleSelectItem(item)}
                        >
                          {inInventory ? 'Buy/Sell' : 'Buy'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    
      {/* Market Place */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            {gameState.currentBorough?.name} Market
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredItems.map((item) => {
              const price = gameState.currentPrices[item.id] || 0;
              const inventoryItem = gameState.inventory.find(i => i.id === item.id);
              const inInventory = inventoryItem && inventoryItem.quantity > 0;
              
              return (
                <div 
                  key={item.id}
                  className={`border rounded-md p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedItem?.id === item.id ? 'bg-muted/50 border-primary' : ''
                  }`}
                  onClick={() => handleSelectItem(item)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${price.toLocaleString()}</p>
                      {inInventory && (
                        <p className="text-xs text-muted-foreground">
                          Own: {inventoryItem?.quantity}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-6 text-muted-foreground">
                No items found matching "{searchQuery}"
              </div>
            )}
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
                <span>Total Cost:</span>
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
                  Prices fluctuate daily. Buy low and sell high to maximize profits!
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
