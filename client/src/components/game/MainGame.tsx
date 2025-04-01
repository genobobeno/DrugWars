import { useState, useEffect } from "react";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import DayCounter from "./DayCounter";
import PlayerStats from "./PlayerStats";
import BoroughSelector from "./BoroughSelector";
import Inventory from "./Inventory";
import MarketPlace from "./MarketPlace";
import EventDisplay from "./EventDisplay";
import Banking from "./Banking";
import { getRandomEvent } from "../../lib/gameEvents";
import { Borough } from "../../types/game";
import { Button } from "../ui/button";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useAudio } from "../../lib/stores/useAudio";

export default function MainGame() {
  const { 
    gameState, 
    setCurrentBorough, 
    updatePrices, 
    progressDay, 
    setGameEvent,
    clearGameEvent
  } = useGlobalGameState();
  const { playHit, playSuccess } = useAudio();
  const [selectedItemToSell, setSelectedItemToSell] = useState<string | null>(null);
  
  // Handle initial game setup
  useEffect(() => {
    if (!gameState.currentBorough && gameState.boroughs.length > 0) {
      // Set initial borough if not set (first time starting)
      setCurrentBorough(gameState.boroughs[0]);
    }
  }, [gameState.boroughs, gameState.currentBorough, setCurrentBorough]);
  
  // Handle borough selection
  const handleBoroughSelected = (borough: Borough) => {
    if (borough.id === gameState.currentBorough?.id) {
      return; // Already in this borough
    }
    
    // Set new borough
    setCurrentBorough(borough);
    
    // Check for random event on travel (20% chance)
    if (Math.random() < 0.2) {
      const event = getRandomEvent('travel', gameState);
      if (event) {
        setGameEvent(event);
        return;
      }
    }
    
    // Update prices and progress to next day when traveling
    updatePrices();
    progressDay();
    playSuccess();
  };
  
  // Handle ending the day
  const handleEndDay = () => {
    playSuccess();
    
    // Check for random events on end of day (30% chance)
    if (Math.random() < 0.3) {
      const event = getRandomEvent('daily', gameState);
      if (event) {
        setGameEvent(event);
        return; // Wait for event to be closed before progressing
      }
    }
    
    // Update prices and progress to next day
    updatePrices();
    progressDay();
  };
  
  // Handle selling an item
  const handleSellClick = (itemId: string) => {
    setSelectedItemToSell(itemId);
    playHit();
  };
  
  // Handle event closed
  const handleEventClosed = () => {
    clearGameEvent();
  };
  
  return (
    <div className="container mx-auto max-w-5xl p-4">
      {/* Day Counter and Player Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DayCounter />
        <PlayerStats />
      </div>
      
      {/* Borough Selector */}
      <div className="mb-4">
        <BoroughSelector onBoroughSelected={handleBoroughSelected} />
      </div>
      
      {/* Main Game Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Market and Items */}
        <div className="md:col-span-2">
          <MarketPlace 
            selectedItemToSell={selectedItemToSell} 
            clearSelectedItem={() => setSelectedItemToSell(null)} 
          />
        </div>
        
        {/* Inventory, Banking, and End Day */}
        <div className="md:col-span-1">
          <Inventory onSellClick={handleSellClick} />
          
          <Banking />
          
          <Button 
            className="w-full mb-4" 
            onClick={handleEndDay}
            size="lg"
          >
            <CalendarDays className="mr-2 h-5 w-5" />
            End Day {gameState.currentDay}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Event Display */}
      <EventDisplay onClose={handleEventClosed} />
    </div>
  );
}
