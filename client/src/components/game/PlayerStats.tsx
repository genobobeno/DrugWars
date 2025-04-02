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
          return "/images/boroughs/NY_Bronx.PNG";
        case "brooklyn":
          return "/images/boroughs/NY_Brooklyn.PNG";
        case "manhattan":
          return "/images/boroughs/NY_Manhattan.PNG";
        case "queens":
          return "/images/boroughs/NY_Queens.PNG";
        case "staten_island":
          return "/images/boroughs/NY_StatenIsland.PNG";
        default:
          return "/images/boroughs/NY_Manhattan.PNG"; // Default to Manhattan
      }
    };
    
    if (gameState.currentBorough) {
      setBackgroundImage(getBoroughImage(gameState.currentBorough.id));
    } else {
      setBackgroundImage("/images/boroughs/NY_Manhattan.PNG");
    }
  }, [gameState.currentBorough]);
  
  // Format values as locale strings
  const cashFormatted = gameState?.cash?.toLocaleString() || "0";
  const debtFormatted = gameState?.debt?.toLocaleString() || "0";
  const bankFormatted = gameState?.bank?.toLocaleString() || "0";
  
  return (
    <div className={`relative ${headerHidden ? "" : "rounded-md overflow-hidden mb-4"} h-full flex flex-col`} style={{ minHeight: '400px' }}>
      {/* Borough Background Image - Full width, bottom-justified */}
      {!headerHidden && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover"
          style={{ 
            backgroundImage: `url('${backgroundImage}')`,
            opacity: 0.9, // More visible background
            backgroundPosition: "center bottom",
          }}
        />
      )}
      
      {/* Dark overlay to improve text readability - lighter to see background better */}
      {!headerHidden && (
        <div className="absolute inset-0 bg-black opacity-40" />
      )}
      
      {/* Borough Title */}
      {!headerHidden && (
        <div className="relative z-10 pt-4 px-4 text-center">
          <h2 className="text-xl font-bold text-white drop-shadow-md">
            {gameState?.currentBorough 
              ? `${gameState.currentBorough.name}` 
              : "Select a Borough"}
          </h2>
        </div>
      )}
      
      {/* Stats Panel - Positioned at bottom with clear spacing from top */}
      <div className={`relative z-10 ${headerHidden ? "" : "mt-auto p-4 bg-black/70 backdrop-blur-sm"}`}>
        {!headerHidden && <h3 className="text-sm uppercase tracking-wider mb-3 text-white/90">Player Stats</h3>}
        
        {/* Health Bar - More prominent at the top */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1 text-white">
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1 text-red-500" fill="currentColor" />
              <span>Health</span>
            </div>
            <span>{gameState?.health || 100}%</span>
          </div>
          <Progress 
            value={gameState?.health || 100} 
            className={`h-3 bg-gray-700 [&>div]:${
              gameState?.health > 70 ? "bg-green-500" :
              gameState?.health > 40 ? "bg-yellow-500" :
              "bg-red-500"
            }`}
          />
        </div>
        
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
      </div>
    </div>
  );
}
