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
  Shirt,
  Zap,
  UserRoundX,
  UserRoundCheck,
  UserRound
} from "lucide-react";
import NPCEncounter from "./NPCEncounter";
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
  "police_encounter": ShieldAlert,
  "market": Banknote,
  "health": CircleAlert,
  "inventory": Package,
  "debt": BadgeAlert,
  "cash": Medal,
  "trenchcoat": Shirt,
  "gun": Zap,
  "neutral": AlertCircle,
  "beneficial": Shield,
  "harmful": PanelBottom,
  "npc": UserRound
};

interface EventDisplayProps {
  onClose: () => void;
}

export default function EventDisplay({ onClose }: EventDisplayProps) {
  const { gameState, currentEvent, setGameEvent } = useGlobalGameState();
  const { playHit, playSuccess } = useAudio();
  const [icon, setIcon] = useState<LucideIcon>(AlertCircle);
  const [iconColor, setIconColor] = useState("text-amber-500");
  
  // State for police encounter interaction
  const [policeState, setPoliceState] = useState({
    numCops: 0,
    hasGuns: false,
    gunType: "",
    bribeAmount: 0,
    isRunning: false,
    isGunfight: false,
    message: "",
    isComplete: false,
    healthLost: 0,
    copsDefeated: 0
  });
  
  // Generate a random price for trenchcoat between $100 and $300
  const trenchcoatPrice = useMemo(() => {
    return Math.floor(Math.random() * 201) + 100; // 100 to 300
  }, [currentEvent?.id]);
  
  // Generate a random inventory space increase between 10 and 35
  const spaceIncrease = useMemo(() => {
    return Math.floor(Math.random() * 26) + 10; // 10 to 35
  }, [currentEvent?.id]);
  
  // Generate a random price for gun between $250 and $750
  const gunPrice = useMemo(() => {
    return Math.floor(Math.random() * 501) + 250; // 250 to 750
  }, [currentEvent?.id]);
  
  // List of gun types to choose from
  const gunTypes = ["revolver", "beretta", "glock", "uzi"];
  
  // Select a random gun type
  const gunType = useMemo(() => {
    return gunTypes[Math.floor(Math.random() * gunTypes.length)];
  }, [currentEvent?.id]);
  
  // Generate random number of cops between 2 and 11
  const numCops = useMemo(() => {
    return Math.floor(Math.random() * 10) + 2; // 2 to 11
  }, [currentEvent?.id]);
  
  // Calculate bribe amount based on cash on hand (25-50% of cash)
  const bribeAmount = useMemo(() => {
    if (!gameState || gameState.cash < 100) return 0;
    
    // Ensure minimum bribe is within player's cash limits
    const minBribe = Math.min(Math.max(100, Math.floor(gameState.cash * 0.25)), gameState.cash);
    const maxBribe = Math.min(gameState.cash, Math.floor(gameState.cash * 0.5));
    
    // Handle case where min and max are the same (low cash)
    if (minBribe >= maxBribe) return minBribe;
    
    return Math.floor(Math.random() * (maxBribe - minBribe + 1)) + minBribe;
  }, [gameState?.cash, currentEvent?.id]);
  
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
    
    // If this is a trenchcoat event, update the description
    if (currentEvent.type === "trenchcoat" && currentEvent.id === "trenchcoat_offer") {
      // Only update the description if necessary
      if (!currentEvent.description.includes(`$${trenchcoatPrice}`)) {
        const updatedEvent = {
          ...currentEvent,
          description: `A shady vendor offers you a larger trenchcoat with more pockets for $${trenchcoatPrice}. It will increase your inventory capacity by ${spaceIncrease} slots.`,
          // Don't add effects here - they will be applied in the purchase handler
          impactSummary: [
            `-$${trenchcoatPrice} cash`,
            `+${spaceIncrease} inventory capacity`
          ]
        };
        setGameEvent(updatedEvent);
      }
    }
    
    // If this is a gun offer event, update the description
    if (currentEvent.type === "gun" && currentEvent.id === "gun_offer") {
      if (!currentEvent.description.includes(`$${gunPrice}`)) {
        const capitalizedGunType = gunType.charAt(0).toUpperCase() + gunType.slice(1);
        const updatedEvent = {
          ...currentEvent,
          title: `${capitalizedGunType} Offer`,
          description: `A weapons dealer offers you a ${gunType} for $${gunPrice}. This will help protect you on the streets.`,
          // Don't add effects here - they will be applied in the purchase handler
          impactSummary: [
            `-$${gunPrice} cash`,
            "+1 gun for protection"
          ]
        };
        setGameEvent(updatedEvent);
      }
    }
    
    // If this is a police encounter event, set up the police encounter
    if (currentEvent.type === "police_encounter" && currentEvent.id === "police_encounter") {
      if (!currentEvent.effects) {
        // Update the police state
        setPoliceState(prevState => ({
          ...prevState,
          numCops: numCops,
          hasGuns: gameState.guns > 0,
          gunType: gameState.guns > 0 ? gunTypes[Math.min(gameState.guns - 1, gunTypes.length - 1)] : "",
          bribeAmount: bribeAmount,
          message: ""
        }));
        
        // Update the event description
        const gunText = gameState.guns > 0 ? 
          ` You have ${gameState.guns} gun(s) available to defend yourself.` : 
          " You don't have any guns to defend yourself.";
          
        const updatedEvent = {
          ...currentEvent,
          title: `Police Confrontation: ${numCops} Officers`,
          description: `You've encountered ${numCops} police officers patrolling the area!${gunText} What will you do?`,
          effects: [],
          impactSummary: []
        };
        
        setGameEvent(updatedEvent);
      }
    }
  }, [currentEvent, playHit, playSuccess, trenchcoatPrice, spaceIncrease, gunPrice, gunType, setGameEvent, numCops, bribeAmount, gameState?.guns]);
  
  // If no event, don't render
  if (!currentEvent) {
    return null;
  }
  
  const IconComponent = icon;
  
  // Determine if this is a trenchcoat offer event
  const isTrenchcoatOffer = currentEvent.type === "trenchcoat" && currentEvent.id === "trenchcoat_offer";
  
  // Determine if this is a gun offer event
  const isGunOffer = currentEvent.type === "gun" && currentEvent.id === "gun_offer";
  
  // Determine if this is a police encounter event
  const isPoliceEncounter = currentEvent.type === "police_encounter" && currentEvent.id === "police_encounter";
  
  // Determine if this is an NPC encounter
  const isNPCEncounter = currentEvent.type === "npc" && currentEvent.npc;
  
  // Check if player can afford the trenchcoat
  const canAffordTrenchcoat = isTrenchcoatOffer && gameState.cash >= trenchcoatPrice;
  
  // Check if player can afford the gun
  const canAffordGun = isGunOffer && gameState.cash >= gunPrice;
  
  // Check if player can afford the bribe
  const canAffordBribe = isPoliceEncounter && gameState.cash >= bribeAmount;
  
  // Check if police encounter is complete
  const isPoliceEncounterComplete = isPoliceEncounter && policeState.isComplete;
  
  const handleTrenchcoatPurchase = () => {
    if (isTrenchcoatOffer && canAffordTrenchcoat) {
      // Create effects for the trenchcoat purchase
      const effects = [
        { type: 'cash' as const, value: -trenchcoatPrice },
        { type: 'maxInventorySpace' as const, value: spaceIncrease }
      ];
      
      // Get the Zustand store actions for updating game state
      const { updateCash, updateInventorySpace, addToEventHistory } = useGlobalGameState.getState();
      
      // Apply effects directly using store actions
      updateCash(-trenchcoatPrice); // Deduct cash
      updateInventorySpace(spaceIncrease); // Increase inventory space
      
      // Make sure we have the current event with effects
      let eventToSave = currentEvent;
      if (!currentEvent.effects) {
        eventToSave = {
          ...currentEvent,
          effects: effects,
          impactSummary: [
            `-$${trenchcoatPrice} cash`,
            `+${spaceIncrease} inventory capacity`
          ]
        };
      }
      
      // Add this event to event history if needed
      if (!gameState.eventHistory.some(event => event.id === currentEvent.id)) {
        addToEventHistory(eventToSave);
      }
      
      // Play sound effect
      playSuccess();
      
      console.log(`Trenchcoat purchased: Increased inventory space by ${spaceIncrease} units`);
    }
    onClose();
  };
  
  const handleGunPurchase = () => {
    if (isGunOffer && canAffordGun) {
      try {
        // Create effects for the gun purchase
        const effects = [
          { type: 'cash' as const, value: -gunPrice },
          { type: 'guns' as const, value: 1 }
        ];
        
        // Use the global buyGuns function with dynamic price
        const { buyGuns } = useGlobalGameState.getState();
        buyGuns(1, gunPrice);
        
        // Make sure we have the current event with effects
        let eventToSave = currentEvent;
        if (!currentEvent.effects) {
          const capitalizedGunType = gunType.charAt(0).toUpperCase() + gunType.slice(1);
          eventToSave = {
            ...currentEvent,
            title: `${capitalizedGunType} Purchase`,
            effects: effects,
            impactSummary: [
              `-$${gunPrice} cash`,
              "+1 gun for protection"
            ]
          };
        }
        
        // Add this event to event history if needed
        const { gameState } = useGlobalGameState.getState();
        if (!gameState.eventHistory.some(event => event.id === currentEvent.id)) {
          const updatedHistory = [...gameState.eventHistory, eventToSave];
          setLocalStorage("nyc-hustler-game-state", {
            ...gameState,
            eventHistory: updatedHistory
          });
        }
        
        playSuccess();
      } catch (error) {
        console.error("Failed to purchase gun:", error);
      }
    }
    onClose();
  };
  
  // Police encounter handlers
  const handleRunFromPolice = () => {
    // 40% chance of successful escape
    const escaped = Math.random() < 0.4;
    
    if (escaped) {
      // Get current game state
      const { gameState: currentGameState } = useGlobalGameState.getState();
      let droppedMessage = "";
      let updatedGameState = { ...currentGameState };
      
      // Check if player has any inventory
      const hasInventory = currentGameState.inventory.length > 0 && 
                          currentGameState.inventory.some(item => item.quantity > 0);
      
      // 70% chance of dropping some drugs during escape
      if (hasInventory && Math.random() < 0.7) {
        // Calculate the percentage to drop (0-25%)
        const percentageToDrop = Math.floor(Math.random() * 26); // 0-25%
        
        if (percentageToDrop > 0) {
          // Update each inventory item
          const updatedInventory = currentGameState.inventory.map(item => {
            const dropAmount = Math.floor(item.quantity * percentageToDrop / 100);
            return {
              ...item,
              quantity: Math.max(0, item.quantity - dropAmount)
            };
          })
          .filter(item => item.quantity > 0); // Remove any empty items
          
          // Update game state with dropped inventory
          updatedGameState = {
            ...updatedGameState,
            inventory: updatedInventory
          };
          
          droppedMessage = percentageToDrop > 0 
            ? " You dropped some drugs while running." 
            : "";
        }
      }
      
      // Player escaped
      setPoliceState(prevState => ({
        ...prevState,
        isRunning: true,
        isComplete: true,
        message: `You managed to escape from the police!${droppedMessage}`
      }));
      
      // Save updated game state
      setLocalStorage("nyc-hustler-game-state", updatedGameState);
      
      playSuccess();
    } else {
      // Failed to escape
      setPoliceState(prevState => ({
        ...prevState,
        isRunning: true,
        message: "You failed to escape from the police. They're still after you!"
      }));
      
      playHit();
    }
  };
  
  const handleGunfight = () => {
    if (!gameState.guns) return;
    
    setPoliceState(prevState => ({
      ...prevState,
      isGunfight: true,
      isRunning: false
    }));
    
    // Determine number of shots based on guns owned
    const numShots = Math.min(gameState.guns, 2);
    
    // Special case for uzi
    const hasUzi = policeState.gunType === "uzi";
    
    // Calculate shots that hit (40% chance per shot)
    let copsDefeated = 0;
    
    for (let i = 0; i < numShots; i++) {
      if (Math.random() < 0.4) {
        if (hasUzi && i === 0) {
          // Uzi can take out 1-5 cops in one burst
          copsDefeated += Math.floor(Math.random() * 5) + 1;
        } else {
          copsDefeated += 1;
        }
      }
    }
    
    // Limit cops defeated to actual number of cops
    copsDefeated = Math.min(copsDefeated, policeState.numCops);
    
    // Calculate cop shots that hit player (35% chance)
    const remainingCops = policeState.numCops - copsDefeated;
    let hitsTaken = 0;
    
    for (let i = 0; i < remainingCops; i++) {
      if (Math.random() < 0.35) {
        hitsTaken++;
      }
    }
    
    // Calculate health loss (12-20% per hit)
    const healthLossPerHit = Math.floor(Math.random() * 9) + 12; // 12-20%
    const totalHealthLoss = Math.min(hitsTaken * healthLossPerHit, 100);
    
    // Update game state with health loss
    const { gameState: currentGameState } = useGlobalGameState.getState();
    const updatedHealth = Math.max(0, currentGameState.health - totalHealthLoss);
    
    // Update local state
    setPoliceState(prevState => ({
      ...prevState,
      copsDefeated,
      healthLost: totalHealthLoss,
      numCops: remainingCops,
      isComplete: remainingCops === 0 || updatedHealth === 0,
      message: remainingCops === 0
        ? `You defeated all the police officers! You took ${totalHealthLoss}% damage.`
        : updatedHealth === 0
        ? "You've been critically injured and lost consciousness."
        : `You defeated ${copsDefeated} officers, but ${remainingCops} remain. You took ${totalHealthLoss}% damage.`
    }));
    
    // Update global state for health
    const updatedGameState = {
      ...currentGameState,
      health: updatedHealth
    };
    
    setLocalStorage("nyc-hustler-game-state", updatedGameState);
    
    if (remainingCops === 0) {
      playSuccess();
    } else {
      playHit();
    }
  };
  
  const handleBribePolice = () => {
    if (!canAffordBribe || bribeAmount <= 0) return;
    
    // Get current game state
    const { gameState: currentGameState } = useGlobalGameState.getState();
    
    // Double-check we have enough cash
    if (currentGameState.cash < bribeAmount) {
      setPoliceState(prevState => ({
        ...prevState,
        message: "You don't have enough cash to bribe the officers!"
      }));
      return;
    }
    
    // Increase bribe amount if player has guns
    const effectiveBribeAmount = gameState.guns > 0 
      ? Math.floor(bribeAmount * 1.5) 
      : bribeAmount;
    
    // Ensure we don't deduct more than what's available
    const actualBribeAmount = Math.min(effectiveBribeAmount, currentGameState.cash);
    const updatedCash = currentGameState.cash - actualBribeAmount;
    
    // Update local state
    setPoliceState(prevState => ({
      ...prevState,
      isComplete: true,
      message: `You bribed the officers with $${actualBribeAmount} and they let you go.`
    }));
    
    // Update global state for cash
    const updatedGameState = {
      ...currentGameState,
      cash: updatedCash
    };
    
    setLocalStorage("nyc-hustler-game-state", updatedGameState);
    
    playSuccess();
  };
  
  const handleCompletePoliceEncounter = () => {
    const { addToEventHistory, visitPrivateDoctor } = useGlobalGameState.getState();
    
    // Check if player defeated all cops
    if (policeState.isComplete && policeState.numCops === 0) {
      // Calculate private doctor cost ($1000-$3000)
      const doctorCost = 1000 + Math.floor(Math.random() * 2001);
      
      // Check if player can afford doctor
      if (gameState.cash >= doctorCost) {
        // Show confirmation dialog
        const confirmDoctor = window.confirm(
          `After your gunfight with the police, you need to see a private doctor to recover. 
          The doctor will charge $${doctorCost} and you'll need to lay low for a day. Do you want to proceed?`
        );
        
        if (confirmDoctor) {
          try {
            // Pay doctor, recover fully, and lose a day
            visitPrivateDoctor(doctorCost);
            
            // Add event to history for record keeping
            if (currentEvent) {
              addToEventHistory(currentEvent);
            }
            
            onClose();
            return;
          } catch (error) {
            console.error("Error visiting doctor:", error);
            alert("Not enough cash to pay the doctor!");
          }
        }
      } else {
        alert("You don't have enough cash to pay a private doctor ($" + doctorCost + "). You'll need to recover on your own.");
      }
    }
    
    // Add the police encounter to history if needed
    if (currentEvent) {
      addToEventHistory(currentEvent);
    }
    
    onClose();
  };
  
  // For NPC encounters, we delegate to the NPCEncounter component
  if (isNPCEncounter) {
    return <NPCEncounter onClose={onClose} />;
  }

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
        
        {/* Police encounter message */}
        {isPoliceEncounter && policeState.message && (
          <div className="bg-muted/30 p-3 rounded-md text-sm my-2">
            <p className={policeState.isComplete && policeState.numCops === 0 ? "text-green-600" : policeState.healthLost > 0 ? "text-red-600" : ""}>
              {policeState.message}
            </p>
          </div>
        )}
        
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
          ) : isGunOffer ? (
            <>
              <Button 
                variant="outline" 
                onClick={onClose}
              >
                Decline
              </Button>
              <Button 
                onClick={handleGunPurchase}
                disabled={!canAffordGun}
              >
                {canAffordGun ? `Buy for $${gunPrice}` : "Can't Afford"}
              </Button>
            </>
          ) : isPoliceEncounter ? (
            policeState.isComplete ? (
              <Button onClick={handleCompletePoliceEncounter}>
                Continue
              </Button>
            ) : policeState.isRunning && !policeState.isComplete ? (
              <div className="flex flex-col w-full gap-2">
                <Button onClick={handleRunFromPolice} className="w-full">
                  Try to Run Again
                </Button>
                <Button 
                  onClick={handleBribePolice} 
                  disabled={!canAffordBribe}
                  variant="outline"
                  className="w-full"
                >
                  {canAffordBribe ? `Bribe for $${bribeAmount}` : "Can't Afford Bribe"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col w-full gap-2">
                <Button onClick={handleRunFromPolice} className="w-full">
                  Try to Run
                </Button>
                {gameState.guns > 0 && (
                  <Button 
                    onClick={handleGunfight} 
                    variant="destructive"
                    className="w-full"
                  >
                    Start Gunfight
                  </Button>
                )}
                <Button 
                  onClick={handleBribePolice} 
                  disabled={!canAffordBribe}
                  variant="outline"
                  className="w-full"
                >
                  {canAffordBribe ? `Bribe for $${bribeAmount}` : "Can't Afford Bribe"}
                </Button>
              </div>
            )
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
