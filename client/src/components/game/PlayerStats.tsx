import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { Progress } from "../ui/progress";
import { 
  Banknote, 
  Landmark, 
  Heart, 
  Zap,
  DollarSign 
} from "lucide-react";
import { useEffect, useState } from "react";

interface PlayerStatsProps {
  headerHidden?: boolean;
}

export default function PlayerStats({ headerHidden = false }: PlayerStatsProps) {
  const { gameState } = useGlobalGameState();
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  
  // Update background image when borough changes
  useEffect(() => {
    const getBoroughImage = (boroughId: string) => {
      switch (boroughId) {
        case "bronx":
          return "/NY_Bronx.PNG";
        case "brooklyn":
          return "/NY_Brooklyn.PNG";
        case "manhattan":
          return "/NY_Manhattan.PNG";
        case "queens":
          return "/NY_Queens.PNG";
        case "staten_island":
          return "/NY_StatenIsland.PNG";
        default:
          return "/NYBoroughs.webp"; // Default image of all NYC
      }
    };
    
    if (gameState.currentBorough) {
      setBackgroundImage(getBoroughImage(gameState.currentBorough.id));
    } else {
      setBackgroundImage("/NYBoroughs.webp");
    }
  }, [gameState.currentBorough]);
  
  // Format values as locale strings
  const cashFormatted = gameState?.cash?.toLocaleString() || "0";
  const debtFormatted = gameState?.debt?.toLocaleString() || "0";
  const bankFormatted = gameState?.bank?.toLocaleString() || "0";
  
  return (
    <div className={`relative ${headerHidden ? "" : "rounded-md overflow-hidden mb-4"} h-full`}>
      {/* Borough Background Image - Full height */}
      {!headerHidden && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url('${backgroundImage}')`,
            opacity: 0.6, // Semi-transparent background
          }}
        />
      )}
      
      {/* Dark overlay to improve text readability */}
      {!headerHidden && (
        <div className="absolute inset-0 bg-black opacity-60" />
      )}
      
      {/* Borough Title */}
      {!headerHidden && (
        <div className="relative z-10 pt-4 px-4 text-center">
          <h2 className="text-xl font-bold text-white drop-shadow-md">
            {gameState?.currentBorough 
              ? `${gameState.currentBorough.name}` 
              : "Select a Borough"}
          </h2>
          <p className="text-white/80 text-sm">
            Day {gameState.currentDay} of {gameState.totalDays}
          </p>
        </div>
      )}
      
      {/* Stats Panel - Positioned at bottom */}
      <div className={`relative z-10 ${headerHidden ? "" : "absolute bottom-0 left-0 right-0 p-4 bg-black/70 backdrop-blur-sm"}`}>
        {!headerHidden && <h3 className="text-sm uppercase tracking-wider mb-3 text-white/90">Player Stats</h3>}
        
        <div className="grid grid-cols-2 gap-4 text-white">
          {/* Cash - Green */}
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-xs text-white/70">Cash</div>
              <div className="font-bold text-green-500">${cashFormatted}</div>
            </div>
          </div>
          
          {/* Bank - Green */}
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-xs text-white/70">Bank (+{gameState?.bankInterestRate || 5}%)</div>
              <div className="font-bold text-green-500">${bankFormatted}</div>
            </div>
          </div>
          
          {/* Debt - Red */}
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-red-500" />
            <div>
              <div className="text-xs text-white/70">Debt (+{gameState?.debtInterestRate || 10}%)</div>
              <div className="font-bold text-red-500">${debtFormatted}</div>
            </div>
          </div>
          
          {/* Guns - Yellow */}
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <div>
              <div className="text-xs text-white/70">Guns</div>
              <div className="font-bold text-yellow-500">{gameState?.guns || 0}</div>
            </div>
          </div>
        </div>
        
        {/* Health Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1 text-white">
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
