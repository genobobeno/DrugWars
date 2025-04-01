import { useEffect, useState } from "react";
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
  ShieldAlert 
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

// Icon mapping for event types
const eventIcons: Record<string, LucideIcon> = {
  "police": ShieldAlert,
  "market": Banknote,
  "health": CircleAlert,
  "inventory": Package,
  "debt": BadgeAlert,
  "cash": Medal,
  "neutral": AlertCircle,
  "beneficial": Shield,
  "harmful": PanelBottom
};

interface EventDisplayProps {
  onClose: () => void;
}

export default function EventDisplay({ onClose }: EventDisplayProps) {
  const { gameState, currentEvent } = useGlobalGameState();
  const { playHit, playSuccess } = useAudio();
  const [icon, setIcon] = useState<LucideIcon>(AlertCircle);
  const [iconColor, setIconColor] = useState("text-amber-500");
  
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
  }, [currentEvent, playHit, playSuccess]);
  
  // If no event, don't render
  if (!currentEvent) {
    return null;
  }
  
  const IconComponent = icon;
  
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
          <Button onClick={onClose}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
