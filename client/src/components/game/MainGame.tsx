import { useState, useEffect } from "react";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import DayCounter from "./DayCounter";
import PlayerStats from "./PlayerStats";
import BoroughSelector from "./BoroughSelector";
import Inventory from "./Inventory";
import MarketPlace from "./MarketPlace";
import EventDisplay from "./EventDisplay";
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
  const [gamePhase, setGamePhase] = useState<'travel' | 'market'>('travel');
  
  // Handle initial game setup and daily updates
  useEffect(() => {
    if (!gameState.currentBorough && gameState.boroughs.length > 0) {
      // Set initial borough if not set (first time starting)
      setCurrentBorough(gameState.boroughs[0]);
    }
  }, [gameState.boroughs, gameState.currentBorough, setCurrentBorough]);
  
  // Handle borough selection
  const handleBoroughSelected = (borough: Borough) => {
    setCurrentBorough(borough);
    
    // Check for random event on travel (20% chance)
    if (Math.random() < 0.2) {
      const event = getRandomEvent('travel', gameState);
      if (event) {
        setGameEvent(event);
      }
    }
    
    setGamePhase('market');
  };
  
  // Handle ending the day
  const handleEndDay = () => {
    playSuccess();
    
    // Apply daily interest to debt
    // This is handled in the progressDay function in useGlobalGameState
    
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
    setGamePhase('travel');
  };
  
  // Handle selling an item
  const handleSellClick = (itemId: string) => {
    setSelectedItemToSell(itemId);
    playHit();
  };
  
  // Handle event closed
  const handleEventClosed = () => {
    clearGameEvent();
    
    // If the event was triggered by ending the day, continue to the next day
    if (gamePhase === 'market') {
      updatePrices();
      progressDay();
      setGamePhase('travel');
    }
  };
  
  return (
    <div className="container mx-auto max-w-5xl p-4">
      {/* Day Counter */}
      <DayCounter />
      
      {/* Player Stats */}
      <PlayerStats />
      
      {/* Main Game Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {gamePhase === 'travel' ? (
            <BoroughSelector onBoroughSelected={handleBoroughSelected} />
          ) : (
            <MarketPlace selectedItemToSell={selectedItemToSell} clearSelectedItem={() => setSelectedItemToSell(null)} />
          )}
        </div>
        
        <div className="md:col-span-1">
          <Inventory onSellClick={handleSellClick} />
          
          {gamePhase === 'market' && (
            <Button 
              className="w-full mb-4" 
              onClick={handleEndDay}
              size="lg"
            >
              <CalendarDays className="mr-2 h-5 w-5" />
              End Day {gameState.currentDay}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Event Display */}
      <EventDisplay onClose={handleEventClosed} />
    </div>
  );
}
