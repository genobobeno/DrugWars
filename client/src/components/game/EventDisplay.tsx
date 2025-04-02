import { useEffect, useState, useMemo } from "react";
import { 
  AlertCircle, 
  BadgeAlert, 
  Banknote, 
  CircleAlert, 
  LucideIcon, 
  Medal, 
  Package, 
  PanelBottom, 
  Shield, 
  ShieldAlert,
  Shirt
} from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { GameEvent } from "../../types/game";
import { useAudio } from "../../lib/stores/useAudio";
import { setLocalStorage } from "../../lib/utils";

// Icon mapping for event types
const eventIcons: Record<string, LucideIcon> = {
  "police": ShieldAlert,
  "market": Banknote,
  "health": CircleAlert,
  "inventory": Package,
  "debt": BadgeAlert,
  "cash": Medal,
  "trenchcoat": Shirt,
  "neutral": AlertCircle,
  "beneficial": Shield,
  "harmful": PanelBottom
};

interface EventDisplayProps {
  onClose: () => void;
}

export default function EventDisplay({ onClose }: EventDisplayProps) {
  const { gameState, currentEvent, setGameEvent } = useGlobalGameState();
  const { playHit, playSuccess } = useAudio();
  const [icon, setIcon] = useState<LucideIcon>(AlertCircle);
  const [iconColor, setIconColor] = useState("text-amber-500");
  
  // Generate a random price for trenchcoat between $100 and $300
  const trenchcoatPrice = useMemo(() => {
    return Math.floor(Math.random() * 201) + 100; // 100 to 300
  }, [currentEvent?.id]);
  
  // Generate a random inventory space increase between 10 and 35
  const spaceIncrease = useMemo(() => {
    return Math.floor(Math.random() * 26) + 10; // 10 to 35
  }, [currentEvent?.id]);
  
  useEffect(() => {
    if (!currentEvent) return;
    
    // Set icon based on event type
    setIcon(eventIcons[currentEvent.type] || AlertCircle);
    
    // Set icon color based on effect
    if (currentEvent.effect === "positive") {
      setIconColor("text-green-500");
      playSuccess();
    } else if (currentEvent.effect === "negative") {
      setIconColor("text-red-500");
      playHit();
    } else {
      setIconColor("text-amber-500");
    }
    
    // If this is a trenchcoat event, add the price to the description
    if (currentEvent.type === "trenchcoat" && currentEvent.id === "trenchcoat_offer") {
      // Add effects with dynamic price if not already added
      if (!currentEvent.effects) {
        const updatedEvent = {
          ...currentEvent,
          description: `A shady vendor offers you a larger trenchcoat with more pockets for $${trenchcoatPrice}. It will increase your inventory capacity by ${spaceIncrease} slots.`,
          effects: [
            { type: 'cash' as const, value: -trenchcoatPrice },
            { type: 'maxInventorySpace' as const, value: spaceIncrease }
          ],
          impactSummary: [
            `-$${trenchcoatPrice} cash`,
            `+${spaceIncrease} inventory capacity`
          ]
        };
        setGameEvent(updatedEvent);
      }
    }
  }, [currentEvent, playHit, playSuccess, trenchcoatPrice, spaceIncrease, setGameEvent]);
  
  // If no event, don't render
  if (!currentEvent) {
    return null;
  }
  
  const IconComponent = icon;
  
  // Determine if this is a trenchcoat offer event
  const isTrenchcoatOffer = currentEvent.type === "trenchcoat" && currentEvent.id === "trenchcoat_offer";
  
  // Check if player can afford the trenchcoat
  const canAffordTrenchcoat = isTrenchcoatOffer && gameState.cash >= trenchcoatPrice;
  
  const handleTrenchcoatPurchase = () => {
    if (isTrenchcoatOffer && canAffordTrenchcoat && currentEvent?.effects) {
      // Apply all effects from the event
      const updatedGameState = { ...gameState };
      
      currentEvent.effects.forEach(effect => {
        if (effect.type === 'cash') {
          updatedGameState.cash = Math.max(0, updatedGameState.cash + effect.value);
        } else if (effect.type === 'maxInventorySpace') {
          updatedGameState.maxInventorySpace += effect.value;
        }
        // Other effect types are handled by the global event system
      });
      
      // Update game state
      setLocalStorage("nyc-hustler-game-state", updatedGameState);
      
      // Add this event to event history if needed
      if (!gameState.eventHistory.some(event => event.id === currentEvent.id)) {
        updatedGameState.eventHistory = [...updatedGameState.eventHistory, currentEvent];
      }
      
      playSuccess();
    }
    onClose();
  };
  
  return (
    <AlertDialog open={!!currentEvent} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <IconComponent className={`h-6 w-6 ${iconColor}`} />
            <AlertDialogTitle>{currentEvent.title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base py-4">
            {currentEvent.description}
          </AlertDialogDescription>
          
          {/* Show event impact summary */}
          {currentEvent.impactSummary && (
            <div className="bg-muted/30 p-3 rounded-md text-sm mt-2">
              <h4 className="font-medium mb-1">Impact:</h4>
              <ul className="list-disc list-inside">
                {currentEvent.impactSummary.map((impact, idx) => (
                  <li key={idx} className={
                    impact.includes("+") ? "text-green-600" : 
                    impact.includes("-") ? "text-red-600" : ""
                  }>
                    {impact}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          {isTrenchcoatOffer ? (
            <>
              <Button 
                variant="outline" 
                onClick={onClose}
              >
                Decline
              </Button>
              <Button 
                onClick={handleTrenchcoatPurchase}
                disabled={!canAffordTrenchcoat}
              >
                {canAffordTrenchcoat ? `Buy for $${trenchcoatPrice}` : "Can't Afford"}
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>
              Continue
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
