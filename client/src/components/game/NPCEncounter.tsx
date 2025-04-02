import React, { useState, useRef } from "react";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { NPCCharacter, NPCDeal, InventoryItem } from "../../types/game";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { User, UserRound, Banknote, Heart, ShoppingBag, Briefcase, Zap } from "lucide-react";
import { setLocalStorage } from "../../lib/utils";

interface NPCEncounterProps {
  onClose: () => void;
}

export default function NPCEncounter({ onClose }: NPCEncounterProps) {
  const { gameState, currentEvent } = useGlobalGameState();
  const { playSuccess, playHit } = useAudio();
  const npc = currentEvent?.npc;
  
  // State for tracking which deal is selected
  const [selectedDeal, setSelectedDeal] = useState<NPCDeal | null>(null);
  const [dealResult, setDealResult] = useState<string | null>(null);
  const [dealCompleted, setDealCompleted] = useState(false);
  
  if (!npc) {
    return null;
  }
  
  // Get icon based on deal type
  const getDealIcon = (deal: NPCDeal) => {
    switch (deal.type) {
      case 'buy':
        return <Banknote className="h-5 w-5 text-green-500" />;
      case 'sell':
        return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case 'trade':
        return <Briefcase className="h-5 w-5 text-amber-500" />;
      case 'special':
        if (deal.specialEffect?.type === 'health') {
          return <Heart className="h-5 w-5 text-red-500" />;
        } else if (deal.specialEffect?.type === 'guns') {
          return <Zap className="h-5 w-5 text-slate-500" />;
        } else if (deal.specialEffect?.type === 'debt') {
          return <Banknote className="h-5 w-5 text-green-500" />;
        } else if (deal.specialEffect?.type === 'maxInventorySpace') {
          return <ShoppingBag className="h-5 w-5 text-blue-500" />;
        }
        return <UserRound className="h-5 w-5 text-amber-500" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };
  
  // Function to check if player can afford the deal
  const canAffordDeal = (deal: NPCDeal): boolean => {
    const { gameState } = useGlobalGameState.getState();
    
    switch (deal.type) {
      case 'buy':
        // Check if player has cash to buy
        return true; // NPC is buying from player, so no cash needed
      
      case 'sell':
        // Check if player has enough cash and inventory space
        if (!deal.price || !deal.quantity) return false;
        
        const totalCost = deal.price * deal.quantity;
        const currentInventoryCount = gameState.inventory.reduce(
          (sum, item) => sum + item.quantity, 0
        );
        const hasEnoughSpace = currentInventoryCount + deal.quantity <= gameState.maxInventorySpace;
        
        return gameState.cash >= totalCost && hasEnoughSpace;
      
      case 'trade':
        // For trade, check if player has the requested item
        if (!deal.itemId || !deal.quantity) return false;
        
        // In the case of hustler's ecstasy deal, they want 10 weed for 30 ecstasy
        if (deal.id === "hustle_ecstasy_deal") {
          const weedItem = gameState.inventory.find(item => item.id === "weed");
          return weedItem ? weedItem.quantity >= 10 : false;
        }
        
        return false;
      
      case 'special':
        // Check specific special deals
        if (deal.id === "tony_protection") {
          return gameState.cash >= 1000;
        }
        if (deal.id === "tony_debt_reduction") {
          return gameState.cash >= 2000 && gameState.debt > 0;
        }
        if (deal.id === "shadow_space_upgrade") {
          return gameState.cash >= 1500;
        }
        if (deal.id === "doctor_health_pack") {
          return gameState.cash >= 800 && gameState.health < 100;
        }
        if (deal.id === "hustle_gun_deal") {
          return gameState.cash >= 500;
        }
        
        return false;
      
      default:
        return false;
    }
  };
  
  // Function to execute the deal
  const executeDeal = (deal: NPCDeal) => {
    const { gameState: currentGameState } = useGlobalGameState.getState();
    let updatedGameState = { ...currentGameState };
    let resultMessage = "";
    
    switch (deal.type) {
      case 'buy':
        // NPC buying from player
        if (deal.id === "jimmy_buy_cocaine") {
          const cocaineItem = currentGameState.inventory.find(item => item.id === "cocaine");
          
          if (!cocaineItem || cocaineItem.quantity === 0) {
            setDealResult("You don't have any cocaine to sell.");
            return;
          }
          
          // Determine how much cocaine the player wants to sell (all of it)
          const quantityToSell = cocaineItem.quantity;
          const totalValue = quantityToSell * (deal.price || 32000);
          
          // Update inventory
          const updatedInventory = currentGameState.inventory
            .map(item => {
              if (item.id === "cocaine") {
                return { ...item, quantity: 0 }; // Sold all cocaine
              }
              return item;
            })
            .filter(item => item.quantity > 0); // Remove empty items
          
          // Update cash
          updatedGameState = {
            ...updatedGameState,
            cash: updatedGameState.cash + totalValue,
            inventory: updatedInventory
          };
          
          resultMessage = `You sold ${quantityToSell} units of cocaine for $${totalValue}!`;
          playSuccess();
        }
        break;
      
      case 'sell':
        // NPC selling to player
        if (!deal.itemId || !deal.price || !deal.quantity) break;
        
        const totalCost = deal.price * deal.quantity;
        
        // Check player can afford
        if (currentGameState.cash < totalCost) {
          setDealResult("You don't have enough cash for this deal.");
          return;
        }
        
        // Check inventory space
        const currentInventoryCount = currentGameState.inventory.reduce(
          (sum, item) => sum + item.quantity, 0
        );
        
        if (currentInventoryCount + deal.quantity > currentGameState.maxInventorySpace) {
          setDealResult("You don't have enough inventory space for this deal.");
          return;
        }
        
        // Update inventory
        let updatedInventory = [...currentGameState.inventory];
        const existingItemIndex = updatedInventory.findIndex(item => item.id === deal.itemId);
        
        if (existingItemIndex !== -1) {
          // Update existing item
          const existingItem = updatedInventory[existingItemIndex];
          const newTotalQuantity = existingItem.quantity + deal.quantity;
          const newTotalCost = existingItem.avgPurchasePrice * existingItem.quantity + deal.price * deal.quantity;
          const newAvgPrice = Math.round(newTotalCost / newTotalQuantity);
          
          updatedInventory[existingItemIndex] = {
            ...existingItem,
            quantity: newTotalQuantity,
            avgPurchasePrice: newAvgPrice
          };
        } else {
          // Add new item
          updatedInventory.push({
            id: deal.itemId,
            quantity: deal.quantity,
            avgPurchasePrice: deal.price
          });
        }
        
        // Update cash
        updatedGameState = {
          ...updatedGameState,
          cash: updatedGameState.cash - totalCost,
          inventory: updatedInventory
        };
        
        resultMessage = `You purchased ${deal.quantity} units of ${deal.itemName} for $${totalCost}!`;
        playSuccess();
        break;
      
      case 'trade':
        // Trading items
        if (deal.id === "hustle_ecstasy_deal") {
          // This trade gives 30 ecstasy for 10 weed
          const weedItem = currentGameState.inventory.find(item => item.id === "weed");
          
          if (!weedItem || weedItem.quantity < 10) {
            setDealResult("You don't have enough weed for this trade.");
            return;
          }
          
          // Update inventory - remove weed
          let updatedInventory = currentGameState.inventory.map(item => {
            if (item.id === "weed") {
              return { ...item, quantity: item.quantity - 10 };
            }
            return item;
          }).filter(item => item.quantity > 0);
          
          // Add ecstasy to inventory
          const existingEcstasyIndex = updatedInventory.findIndex(item => item.id === "ecstasy");
          
          if (existingEcstasyIndex !== -1) {
            // Update existing ecstasy
            updatedInventory[existingEcstasyIndex] = {
              ...updatedInventory[existingEcstasyIndex],
              quantity: updatedInventory[existingEcstasyIndex].quantity + 30
            };
          } else {
            // Add new ecstasy item
            updatedInventory.push({
              id: "ecstasy",
              quantity: 30,
              avgPurchasePrice: 50 // Estimate a fair price
            });
          }
          
          updatedGameState = {
            ...updatedGameState,
            inventory: updatedInventory
          };
          
          resultMessage = "You traded 10 weed for 30 ecstasy pills!";
          playSuccess();
        }
        break;
      
      case 'special':
        // Special effects
        if (!deal.specialEffect) break;
        
        switch (deal.id) {
          case "tony_protection":
            // $1000 for 25 health
            if (currentGameState.cash < 1000) {
              setDealResult("You don't have enough cash for this deal.");
              return;
            }
            
            updatedGameState = {
              ...updatedGameState,
              cash: updatedGameState.cash - 1000,
              health: Math.min(100, updatedGameState.health + 25)
            };
            
            resultMessage = "Big Tony's protection improves your standing in the streets. Your health increased by 25!";
            playSuccess();
            break;
            
          case "tony_debt_reduction":
            // $2000 to reduce debt by $3000
            if (currentGameState.cash < 2000 || currentGameState.debt === 0) {
              setDealResult("You either don't have enough cash or don't have any debt.");
              return;
            }
            
            updatedGameState = {
              ...updatedGameState,
              cash: updatedGameState.cash - 2000,
              debt: Math.max(0, updatedGameState.debt - 3000)
            };
            
            resultMessage = "Tony's connections came through! Your debt was reduced by $3000.";
            playSuccess();
            break;
            
          case "shadow_space_upgrade":
            // $1500 for +40 inventory space
            if (currentGameState.cash < 1500) {
              setDealResult("You don't have enough cash for this deal.");
              return;
            }
            
            updatedGameState = {
              ...updatedGameState,
              cash: updatedGameState.cash - 1500,
              maxInventorySpace: updatedGameState.maxInventorySpace + 40
            };
            
            resultMessage = "Shadow's connect hooks you up with a custom compartment setup. Your inventory space increased by 40!";
            playSuccess();
            break;
            
          case "doctor_health_pack":
            // $800 for full health
            if (currentGameState.cash < 800 || currentGameState.health >= 100) {
              setDealResult("You either don't have enough cash or are already at full health.");
              return;
            }
            
            updatedGameState = {
              ...updatedGameState,
              cash: updatedGameState.cash - 800,
              health: 100
            };
            
            resultMessage = "The doctor patches you up completely. Your health is now at 100%!";
            playSuccess();
            break;
            
          case "hustle_gun_deal":
            // $500 for a gun
            if (currentGameState.cash < 500) {
              setDealResult("You don't have enough cash for this deal.");
              return;
            }
            
            updatedGameState = {
              ...updatedGameState,
              cash: updatedGameState.cash - 500,
              guns: updatedGameState.guns + 1
            };
            
            resultMessage = "You got yourself a new piece! Gun count increased by 1.";
            playSuccess();
            break;
        }
        break;
    }
    
    // Save the updated game state
    if (resultMessage) {
      setLocalStorage("nyc-hustler-game-state", updatedGameState);
      setDealResult(resultMessage);
      setDealCompleted(true);
    }
  };
  
  // Handle deal selection
  const handleDealSelect = (deal: NPCDeal) => {
    setSelectedDeal(deal);
    setDealResult(null);
  };
  
  // Handle deal execution
  const handleDealExecute = () => {
    if (!selectedDeal) return;
    
    if (!canAffordDeal(selectedDeal)) {
      setDealResult("You can't afford this deal or don't meet the requirements.");
      return;
    }
    
    executeDeal(selectedDeal);
  };
  
  // Handle close
  const handleClose = () => {
    onClose();
  };
  
  return (
    <AlertDialog open={!!npc} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <UserRound className="h-6 w-6 text-amber-500" />
            <AlertDialogTitle className="text-xl">{npc.name}</AlertDialogTitle>
          </div>
          
          <AlertDialogDescription className="text-base">
            <p className="mb-2">{npc.description}</p>
            <p className="italic">{npc.personality}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="grid gap-4 py-4">
          <h3 className="font-semibold text-lg">Available Deals:</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {npc.deals.map((deal) => (
              <div 
                key={deal.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors
                  ${selectedDeal?.id === deal.id ? 'border-primary bg-muted/40' : 'border-muted hover:border-primary/50'}
                  ${canAffordDeal(deal) ? '' : 'opacity-60'}
                `}
                onClick={() => handleDealSelect(deal)}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getDealIcon(deal)}
                  <h4 className="font-medium">
                    {deal.type === 'buy' ? 'Wants to Buy' : 
                     deal.type === 'sell' ? 'Offering to Sell' :
                     deal.type === 'trade' ? 'Trade Proposal' : 'Special Offer'}
                  </h4>
                </div>
                <p className="text-sm mb-2">{deal.description}</p>
                
                {/* Deal details */}
                {deal.type === 'buy' && deal.price && (
                  <p className="text-green-600 text-sm font-semibold">
                    Buying at ${deal.price} per unit
                  </p>
                )}
                
                {deal.type === 'sell' && deal.price && deal.quantity && (
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600 font-semibold">
                      {deal.quantity} units for ${deal.price} each
                    </span>
                    <span className="text-green-600 font-semibold">
                      Total: ${deal.price * deal.quantity}
                    </span>
                  </div>
                )}
                
                {deal.type === 'special' && (
                  <p className="text-amber-600 text-sm font-semibold">
                    {deal.id === 'tony_protection' && 'Cost: $1000'}
                    {deal.id === 'tony_debt_reduction' && 'Cost: $2000'}
                    {deal.id === 'shadow_space_upgrade' && 'Cost: $1500'}
                    {deal.id === 'doctor_health_pack' && 'Cost: $800'}
                    {deal.id === 'hustle_gun_deal' && 'Cost: $500'}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          {/* Deal result message */}
          {dealResult && (
            <div className={`p-3 rounded-md text-sm ${dealCompleted ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {dealResult}
            </div>
          )}
        </div>
        
        <AlertDialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
          >
            {dealCompleted ? 'Done' : 'No Thanks'}
          </Button>
          
          {!dealCompleted && selectedDeal && (
            <Button
              onClick={handleDealExecute}
              disabled={!canAffordDeal(selectedDeal)}
            >
              Accept Deal
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}