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
      <div className="relative bg-blue-50 h-[250px] w-full">
        {/* NYC Map SVG */}
        <svg viewBox="0 0 500 500" className="h-full w-full">
          {/* Water background */}
          <rect x="0" y="0" width="500" height="500" fill="#c9e6ff" />
          
          {/* Staten Island */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <path 
                  d="M100,350 L160,380 L130,450 L60,400 Z" 
                  fill={gameState.currentBorough?.id === "staten_island" ? "#6366f1" : "#d1d5db"}
                  stroke="#374151" 
                  strokeWidth="2"
                  className={`cursor-pointer hover:fill-indigo-400 ${gameState.currentBorough?.id === "staten_island" ? "" : "hover:fill-gray-300"}`}
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "staten_island")!)}
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="text-sm font-semibold">Staten Island</div>
                <p className="text-xs">Suburban and isolated with less police presence</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Brooklyn */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <path 
                  d="M250,300 L320,280 L350,370 L240,380 Z" 
                  fill={gameState.currentBorough?.id === "brooklyn" ? "#6366f1" : "#d1d5db"}
                  stroke="#374151" 
                  strokeWidth="2"
                  className={`cursor-pointer hover:fill-indigo-400 ${gameState.currentBorough?.id === "brooklyn" ? "" : "hover:fill-gray-300"}`}
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "brooklyn")!)}
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="text-sm font-semibold">Brooklyn</div>
                <p className="text-xs">Trendy and diverse with artsy neighborhoods</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Queens */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <path 
                  d="M320,150 L420,180 L390,300 L320,280 Z" 
                  fill={gameState.currentBorough?.id === "queens" ? "#6366f1" : "#d1d5db"}
                  stroke="#374151" 
                  strokeWidth="2"
                  className={`cursor-pointer hover:fill-indigo-400 ${gameState.currentBorough?.id === "queens" ? "" : "hover:fill-gray-300"}`}
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "queens")!)}
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="text-sm font-semibold">Queens</div>
                <p className="text-xs">Diverse and residential with many cultural communities</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Manhattan */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <path 
                  d="M230,160 L260,170 L250,300 L220,290 Z" 
                  fill={gameState.currentBorough?.id === "manhattan" ? "#6366f1" : "#d1d5db"}
                  stroke="#374151" 
                  strokeWidth="2"
                  className={`cursor-pointer hover:fill-indigo-400 ${gameState.currentBorough?.id === "manhattan" ? "" : "hover:fill-gray-300"}`}
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "manhattan")!)}
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="text-sm font-semibold">Manhattan</div>
                <p className="text-xs">The heart of NYC, expensive and heavily policed</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Bronx */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <path 
                  d="M230,160 L320,150 L310,80 L200,100 Z" 
                  fill={gameState.currentBorough?.id === "bronx" ? "#6366f1" : "#d1d5db"}
                  stroke="#374151" 
                  strokeWidth="2"
                  className={`cursor-pointer hover:fill-indigo-400 ${gameState.currentBorough?.id === "bronx" ? "" : "hover:fill-gray-300"}`}
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "bronx")!)}
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="text-sm font-semibold">The Bronx</div>
                <p className="text-xs">Rough and varied, with high crime areas and family neighborhoods</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Borough labels */}
          <text x="110" y="390" className="text-xs font-semibold fill-slate-800">Staten Island</text>
          <text x="280" y="340" className="text-xs font-semibold fill-slate-800">Brooklyn</text>
          <text x="370" y="230" className="text-xs font-semibold fill-slate-800">Queens</text>
          <text x="230" y="230" className="text-xs font-semibold fill-slate-800">Manhattan</text>
          <text x="240" y="120" className="text-xs font-semibold fill-slate-800">Bronx</text>
        </svg>
        
        {/* Current Location Marker */}
        {gameState.currentBorough && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
            Currently in: {gameState.currentBorough.name}
          </div>
        )}
      </div>
      
      {/* Borough description - shows when a borough is selected */}
      {gameState.currentBorough && !headerHidden && (
        <div className="p-3 border-t border-dashed border-gray-200 bg-gray-50 text-sm">
          <p className="italic text-gray-600">{gameState.currentBorough.description}</p>
        </div>
      )}
    </div>
  );
}
