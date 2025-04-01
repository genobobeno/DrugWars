import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { Borough } from "../../types/game";
import { useAudio } from "../../lib/stores/useAudio";
import { MapPin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface BoroughSelectorProps {
  onBoroughSelected: (borough: Borough) => void;
  headerHidden?: boolean;
}

export default function BoroughSelector({ onBoroughSelected, headerHidden = false }: BoroughSelectorProps) {
  const { gameState } = useGlobalGameState();
  const { playHit } = useAudio();

  // Handle borough selection - directly trigger travel
  const handleSelect = (borough: Borough) => {
    if (borough.id === gameState.currentBorough?.id) return;
    playHit();
    onBoroughSelected(borough);
  };

  return (
    <div className={`${headerHidden ? "" : "bg-white border rounded-lg shadow-sm w-full mb-4 overflow-hidden"}`}>
      {/* Header - Only shown if headerHidden is false */}
      {!headerHidden && (
        <div className="border-b px-6 py-4">
          <div className="flex items-center gap-2 font-semibold">
            <MapPin className="h-5 w-5" />
            <span>New York City Map</span>
            {gameState.currentBorough && (
              <span className="text-sm font-normal text-muted-foreground">
                (Current: {gameState.currentBorough.name})
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Interactive NYC Map */}
      <div className="relative bg-gray-900 h-[300px] w-full overflow-hidden">
        {/* NYC Map Background Image */}
        <img 
          src="/images/nyc-map.svg" 
          alt="NYC Map" 
          className="w-full h-full object-cover"
        />
        
        {/* Interactive Borough Overlays */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 800 800" className="w-full h-full">
            {/* Staten Island - Bottom Left */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <path 
                    d="M150,550 C200,530 250,550 280,580 C310,610 300,650 250,670 C200,690 150,670 130,630 C110,590 130,560 150,550 Z" 
                    fill={gameState.currentBorough?.id === "staten_island" ? "#4f46e5" : "#00000000"}
                    stroke={gameState.currentBorough?.id === "staten_island" ? "#ffffff" : "#ffffff50"}
                    strokeWidth="2"
                    opacity={gameState.currentBorough?.id === "staten_island" ? "0.7" : "0.2"}
                    className={`cursor-pointer hover:opacity-50 hover:stroke-white transition-all duration-200`}
                    onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "staten_island")!)}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="text-sm font-semibold">Staten Island</div>
                  <p className="text-xs">Suburban and isolated with less police presence</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Brooklyn - Bottom Right */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <path 
                    d="M430,480 C450,460 500,450 550,480 C600,510 620,560 590,600 C560,640 500,650 450,630 C400,610 380,540 430,480 Z" 
                    fill={gameState.currentBorough?.id === "brooklyn" ? "#4f46e5" : "#00000000"}
                    stroke={gameState.currentBorough?.id === "brooklyn" ? "#ffffff" : "#ffffff50"}
                    strokeWidth="2"
                    opacity={gameState.currentBorough?.id === "brooklyn" ? "0.7" : "0.2"}
                    className={`cursor-pointer hover:opacity-50 hover:stroke-white transition-all duration-200`}
                    onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "brooklyn")!)}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="text-sm font-semibold">Brooklyn</div>
                  <p className="text-xs">Trendy and diverse with artsy neighborhoods</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Queens - Mid Right */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <path 
                    d="M430,400 C460,360 520,330 580,360 C640,390 670,450 650,520 C630,590 560,610 500,580 C440,550 400,440 430,400 Z" 
                    fill={gameState.currentBorough?.id === "queens" ? "#4f46e5" : "#00000000"}
                    stroke={gameState.currentBorough?.id === "queens" ? "#ffffff" : "#ffffff50"}
                    strokeWidth="2"
                    opacity={gameState.currentBorough?.id === "queens" ? "0.7" : "0.2"}
                    className={`cursor-pointer hover:opacity-50 hover:stroke-white transition-all duration-200`}
                    onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "queens")!)}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="text-sm font-semibold">Queens</div>
                  <p className="text-xs">Diverse and residential with many cultural communities</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Manhattan - Center */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <path 
                    d="M400,180 C410,170 420,170 425,200 C430,240 430,320 420,380 C410,440 390,480 380,480 C370,480 360,450 365,390 C370,330 380,220 400,180 Z" 
                    fill={gameState.currentBorough?.id === "manhattan" ? "#4f46e5" : "#00000000"}
                    stroke={gameState.currentBorough?.id === "manhattan" ? "#ffffff" : "#ffffff50"}
                    strokeWidth="2"
                    opacity={gameState.currentBorough?.id === "manhattan" ? "0.7" : "0.2"}
                    className={`cursor-pointer hover:opacity-50 hover:stroke-white transition-all duration-200`}
                    onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "manhattan")!)}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="text-sm font-semibold">Manhattan</div>
                  <p className="text-xs">The heart of NYC, expensive and heavily policed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Bronx - Top */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <path 
                    d="M390,180 C410,140 460,120 520,140 C580,160 610,220 580,260 C550,300 490,320 440,300 C390,280 370,220 390,180 Z" 
                    fill={gameState.currentBorough?.id === "bronx" ? "#4f46e5" : "#00000000"}
                    stroke={gameState.currentBorough?.id === "bronx" ? "#ffffff" : "#ffffff50"}
                    strokeWidth="2"
                    opacity={gameState.currentBorough?.id === "bronx" ? "0.7" : "0.2"}
                    className={`cursor-pointer hover:opacity-50 hover:stroke-white transition-all duration-200`}
                    onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "bronx")!)}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="text-sm font-semibold">The Bronx</div>
                  <p className="text-xs">Rough and varied, with high crime areas and family neighborhoods</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </svg>
        </div>
        
        {/* Compass Rose */}
        <div className="absolute top-2 right-2 w-12 h-12 opacity-40">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="11" fill="none" stroke="#f8fafc" strokeWidth="0.5" />
            <line x1="12" y1="1" x2="12" y2="4" stroke="#f8fafc" strokeWidth="0.5" />
            <line x1="12" y1="20" x2="12" y2="23" stroke="#f8fafc" strokeWidth="0.5" />
            <line x1="1" y1="12" x2="4" y2="12" stroke="#f8fafc" strokeWidth="0.5" />
            <line x1="20" y1="12" x2="23" y2="12" stroke="#f8fafc" strokeWidth="0.5" />
            <text x="12" y="3.5" textAnchor="middle" className="text-[5px] fill-white">N</text>
            <text x="12" y="22" textAnchor="middle" className="text-[5px] fill-white">S</text>
            <text x="22" y="12.5" textAnchor="middle" className="text-[5px] fill-white">E</text>
            <text x="2" y="12.5" textAnchor="middle" className="text-[5px] fill-white">W</text>
          </svg>
        </div>
        
        {/* Current Location Badge */}
        {gameState.currentBorough && (
          <div className="absolute top-2 left-2 px-3 py-1 bg-indigo-500 text-white rounded-md drop-shadow-md text-xs font-medium flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></span>
            Currently in: {gameState.currentBorough.name}
          </div>
        )}
      </div>
      
      {/* Borough description - shows when a borough is selected */}
      {gameState.currentBorough && !headerHidden && (
        <div className="p-3 border-t border-gray-700 bg-gray-800 text-sm">
          <p className="italic text-gray-300">{gameState.currentBorough.description}</p>
        </div>
      )}
      
      {/* Scale indicator */}
      <div className="absolute bottom-3 right-3 flex items-center">
        <div className="w-12 h-1 bg-white/30 mr-1"></div>
        <span className="text-[8px] text-white/60">5 mi</span>
      </div>
      
      {/* Borough info for in-panel display */}
      {gameState.currentBorough && headerHidden && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white backdrop-blur-sm p-2 text-xs">
          <p className="font-medium">{gameState.currentBorough.name}</p>
        </div>
      )}
    </div>
  );
}
