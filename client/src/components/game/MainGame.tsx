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
    <div className="container mx-auto p-2 overflow-auto max-h-screen">
      {/* Enable scrolling on the entire page */}
      <style dangerouslySetInnerHTML={{
        __html: `
          html, body {
            overflow-y: auto !important;
            height: 100%;
          }
        `
      }} />
      
      {/* Unified Header Section with Stats and Map - More Compact */}
      <div className="flex flex-col md:flex-row gap-0 mb-3 bg-gray-900 rounded-lg overflow-hidden shadow-md">
        {/* Left Side - Day Counter and Player Stats - Wider */}
        <div className="p-3 space-y-2 flex-grow">
          <DayCounter />
          <PlayerStats headerHidden={true} />
        </div>
        
        {/* Right Side - Borough Selector Map - Fixed width */}
        <div className="border-l border-gray-800 md:w-[400px] flex-shrink-0">
          <BoroughSelector onBoroughSelected={handleBoroughSelected} headerHidden={true} />
        </div>
      </div>
      
      {/* Main Game Area - Wider left panel, fixed-width right panel */}
      <div className="flex flex-col md:flex-row gap-2">
        {/* Market and Items - Wider and flexible */}
        <div className="flex-grow">
          <MarketPlace 
            selectedItemToSell={selectedItemToSell} 
            clearSelectedItem={() => setSelectedItemToSell(null)} 
          />
        </div>
        
        {/* Inventory and Banking - Fixed 400px width */}
        <div className="md:w-[400px] flex-shrink-0 space-y-2">
          <Inventory onSellClick={handleSellClick} />
          <Banking />
        </div>
      </div>
      
      {/* Event Display */}
      <EventDisplay onClose={handleEventClosed} />
    </div>
  );
}
