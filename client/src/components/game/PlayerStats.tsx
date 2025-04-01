import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { Progress } from "../ui/progress";
import { 
  Banknote, 
  Landmark, 
  Heart, 
  Shield,
  DollarSign 
} from "lucide-react";
import { useEffect, useState } from "react";

export default function PlayerStats() {
  const { gameState } = useGlobalGameState();
  const [displayImage, setDisplayImage] = useState(""); // Will store image for selected borough
  
  // Update display image when borough changes
  useEffect(() => {
    // In the future, this would use actual images for each borough
    const getBoroughImage = (boroughId: string) => {
      switch (boroughId) {
        case "manhattan":
          return "Manhattan skyline"; // Placeholder for actual image
        case "brooklyn":
          return "Brooklyn Bridge"; // Placeholder for actual image
        case "bronx":
          return "Yankee Stadium"; // Placeholder for actual image
        case "queens":
          return "Flushing Meadows"; // Placeholder for actual image
        case "staten_island":
          return "Staten Island Ferry"; // Placeholder for actual image
        default:
          return "New York City skyline"; // Default image
      }
    };
    
    if (gameState.currentBorough) {
      setDisplayImage(getBoroughImage(gameState.currentBorough.id));
    }
  }, [gameState.currentBorough]);
  
  // Format values as locale strings
  const cashFormatted = gameState?.cash?.toLocaleString() || "0";
  const debtFormatted = gameState?.debt?.toLocaleString() || "0";
  const bankFormatted = gameState?.bank?.toLocaleString() || "0";
  
  return (
    <div className="bg-black text-white rounded-md overflow-hidden mb-4">
      {/* This would display an actual image of the borough */}
      <div className="h-32 bg-gray-800 flex items-center justify-center text-center p-4">
        <p className="text-muted italic">
          {gameState?.currentBorough 
            ? `You are in ${gameState.currentBorough.name}` 
            : "Choose a borough to begin"}
        </p>
      </div>
      
      {/* Scoreboard */}
      <div className="p-4">
        <h3 className="text-sm uppercase tracking-wider mb-3 opacity-70">Player Stats</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Cash - Green */}
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-xs opacity-70">Cash</div>
              <div className="font-bold text-green-500">${cashFormatted}</div>
            </div>
          </div>
          
          {/* Bank - Green */}
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-xs opacity-70">Bank (+{gameState?.bankInterestRate || 5}%)</div>
              <div className="font-bold text-green-500">${bankFormatted}</div>
            </div>
          </div>
          
          {/* Debt - Red */}
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-red-500" />
            <div>
              <div className="text-xs opacity-70">Debt (+{gameState?.debtInterestRate || 10}%)</div>
              <div className="font-bold text-red-500">${debtFormatted}</div>
            </div>
          </div>
          
          {/* Guns - Yellow */}
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-500" />
            <div>
              <div className="text-xs opacity-70">Guns</div>
              <div className="font-bold text-yellow-500">{gameState?.guns || 0}</div>
            </div>
          </div>
        </div>
        
        {/* Health Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1 text-blue-500" />
              <span>Health</span>
            </div>
            <span>{gameState?.health || 100}%</span>
          </div>
          <Progress 
            value={gameState?.health || 100} 
            className="h-2 bg-gray-700 [&>div]:bg-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
