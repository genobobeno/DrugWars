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
    
    // Check for travel event first (30% chance)
    if (Math.random() < 0.3) {
      const travelEvent = getRandomEvent('travel', gameState);
      if (travelEvent) {
        setGameEvent(travelEvent);
        return;
      }
    }
    
    // If no travel event, check for a daily random event (40% chance)
    // This includes trenchcoat offers, gun offers, police encounters, etc.
    if (Math.random() < 0.4) {
      const dailyEvent = getRandomEvent('daily', gameState);
      if (dailyEvent) {
        setGameEvent(dailyEvent);
        return;
      }
    }
    
    // If no events triggered, just update prices and progress to next day
    updatePrices();
    progressDay();
    playSuccess();
  };
  
  // Handle selling an item
  const handleSellClick = (itemId: string) => {
    setSelectedItemToSell(itemId);
    playHit();
  };
  
  // Handle event closed
  const handleEventClosed = () => {
    // Check if there is a current event in the game state
    const currentEvent = gameState.currentEvent;
    if (currentEvent) {
      // Make sure the event has the current day recorded with it
      const eventWithDay = {
        ...currentEvent,
        day: gameState.currentDay
      };
      
      // Add the event to the history if not already there
      if (!gameState.eventHistory.some(event => event.id === currentEvent.id)) {
        // Update the event history in game state
        const updatedGameState = {
          ...gameState,
          eventHistory: [...gameState.eventHistory, eventWithDay]
        };
        
        // Save the updated state to local storage
        localStorage.setItem("nyc-hustler-game-state", JSON.stringify(updatedGameState));
      }
      
      // Always progress the day after handling ANY event (travel or daily)
      // This ensures that all travel and all daily events lead to day advancement
      updatePrices();
      progressDay();
      playSuccess();
    }
    
    // Clear the current event
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
        {/* Left Side - Day Counter and Player Stats with Borough Background - Wider */}
        <div className="flex-grow relative">
          <div className="absolute top-0 left-0 right-0 z-10 p-3">
            <DayCounter />
          </div>
          <div className="h-[400px]">
            <PlayerStats headerHidden={false} />
          </div>
        </div>
        
        {/* Right Side - Borough Selector Map - Fixed width */}
        <div className="border-l border-gray-800 md:w-[450px] flex-shrink-0">
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
        
        {/* Inventory and Banking - Fixed 350px width */}
        <div className="md:w-[350px] flex-shrink-0 space-y-2">
          <Inventory onSellClick={handleSellClick} />
          <Banking />
        </div>
      </div>
      
      {/* Event Display */}
      <EventDisplay onClose={handleEventClosed} />
    </div>
  );
}
