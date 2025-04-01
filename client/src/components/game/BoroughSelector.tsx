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
      <div className="relative bg-gray-900 h-[270px] w-full">
        {/* NYC Map SVG - More accurate and stylized representation */}
        <svg viewBox="0 0 500 500" className="h-full w-full">
          {/* Water background */}
          <rect x="0" y="0" width="500" height="500" fill="#0d1b2a" />
          
          {/* Water details - rivers, bay */}
          <path 
            d="M50,150 C150,100 200,200 150,350 C100,450 50,400 50,350 Z" 
            fill="#193b5e" 
            opacity="0.6"
          />
          <path 
            d="M350,50 C400,100 420,200 380,350 C320,450 200,400 100,400 C50,400 30,350 50,300 C80,250 150,200 200,250 C250,300 300,250 350,50 Z" 
            fill="#193b5e" 
            opacity="0.3"
          />
          
          {/* Neighboring land masses */}
          <path 
            d="M0,0 L0,500 L50,500 C50,400 80,300 50,200 C20,100 0,50 0,0 Z" 
            fill="#1e293b" 
            stroke="#334155"
            strokeWidth="1"
          />
          <path 
            d="M500,0 L500,500 L400,500 C450,450 470,400 480,350 C490,300 500,200 500,0 Z" 
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="1"
          />
          
          {/* Main street grid - faint overlay */}
          <g opacity="0.1" stroke="#f8fafc" strokeWidth="0.5">
            {/* Manhattan grid */}
            <line x1="240" y1="100" x2="240" y2="300" />
            <line x1="250" y1="100" x2="250" y2="300" />
            <line x1="230" y1="120" x2="250" y2="120" />
            <line x1="230" y1="140" x2="250" y2="140" />
            <line x1="230" y1="160" x2="250" y2="160" />
            <line x1="230" y1="180" x2="250" y2="180" />
            <line x1="230" y1="200" x2="250" y2="200" />
            <line x1="230" y1="220" x2="250" y2="220" />
            <line x1="230" y1="240" x2="250" y2="240" />
            <line x1="230" y1="260" x2="250" y2="260" />
            <line x1="230" y1="280" x2="250" y2="280" />
            
            {/* Brooklyn/Queens grids */}
            <line x1="280" y1="280" x2="380" y2="280" />
            <line x1="280" y1="300" x2="380" y2="300" />
            <line x1="280" y1="320" x2="380" y2="320" />
            <line x1="300" y1="260" x2="300" y2="360" />
            <line x1="320" y1="260" x2="320" y2="360" />
            <line x1="340" y1="260" x2="340" y2="360" />
            <line x1="360" y1="260" x2="360" y2="360" />
          </g>
          
          {/* Bridges and connections */}
          <line x1="255" y1="185" x2="320" y2="220" stroke="#94a3b8" strokeWidth="2" />
          <line x1="240" y1="260" x2="290" y2="290" stroke="#94a3b8" strokeWidth="2" />
          <line x1="180" y1="350" x2="240" y2="330" stroke="#94a3b8" strokeWidth="2" opacity="0.7" />
          
          {/* Landmarks */}
          {/* Statue of Liberty */}
          <circle cx="170" cy="330" r="2" fill="#22c55e" />
          <text x="153" y="320" className="text-[8px] fill-white opacity-60">Liberty Island</text>
          
          {/* Central Park */}
          <rect x="233" y="160" width="14" height="40" fill="#064e3b" opacity="0.6" stroke="#10b981" strokeWidth="0.5" />
          
          {/* JFK Airport */}
          <rect x="380" y="310" width="10" height="10" fill="none" stroke="#a1a1aa" strokeWidth="0.8" />
          <text x="393" y="315" className="text-[6px] fill-white opacity-60">JFK</text>
          
          {/* Yankee Stadium */}
          <circle cx="250" cy="110" r="2" fill="#3b82f6" />
          
          {/* Coney Island */}
          <path d="M330,370 L340,370 L340,375 L330,375 Z" fill="#eab308" />
          
          {/* Battery Park */}
          <circle cx="230" cy="300" r="2" fill="#22c55e" />
          
          {/* Staten Island */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <path 
                  d="M80,350 Q100,340 130,350 Q160,360 150,390 Q140,420 110,430 Q70,430 60,400 Q50,370 80,350 Z" 
                  fill={gameState.currentBorough?.id === "staten_island" ? "#6366f1" : "#94a3b8"}
                  stroke="#f8fafc" 
                  strokeWidth="1.5"
                  className={`cursor-pointer hover:fill-indigo-400 ${gameState.currentBorough?.id === "staten_island" ? "" : "hover:fill-gray-400"}`}
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
                  d="M250,300 Q270,290 300,285 Q330,280 350,310 Q370,340 340,370 Q300,390 250,370 Q230,360 230,340 Q230,310 250,300 Z" 
                  fill={gameState.currentBorough?.id === "brooklyn" ? "#6366f1" : "#94a3b8"}
                  stroke="#f8fafc" 
                  strokeWidth="1.5"
                  className={`cursor-pointer hover:fill-indigo-400 ${gameState.currentBorough?.id === "brooklyn" ? "" : "hover:fill-gray-400"}`}
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
                  d="M320,150 Q350,140 380,160 Q410,180 405,220 Q400,260 380,280 Q340,300 320,280 Q300,260 305,210 Q310,170 320,150 Z" 
                  fill={gameState.currentBorough?.id === "queens" ? "#6366f1" : "#94a3b8"}
                  stroke="#f8fafc" 
                  strokeWidth="1.5"
                  className={`cursor-pointer hover:fill-indigo-400 ${gameState.currentBorough?.id === "queens" ? "" : "hover:fill-gray-400"}`}
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
                  d="M230,120 Q240,110 250,110 Q260,110 260,150 Q260,200 250,250 Q240,300 230,300 Q220,300 220,250 Q220,170 230,120 Z" 
                  fill={gameState.currentBorough?.id === "manhattan" ? "#6366f1" : "#94a3b8"}
                  stroke="#f8fafc" 
                  strokeWidth="1.5"
                  className={`cursor-pointer hover:fill-indigo-400 ${gameState.currentBorough?.id === "manhattan" ? "" : "hover:fill-gray-400"}`}
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
                  d="M230,120 Q240,100 270,90 Q300,80 330,110 Q340,130 320,150 Q290,170 260,150 Q240,140 230,120 Z" 
                  fill={gameState.currentBorough?.id === "bronx" ? "#6366f1" : "#94a3b8"}
                  stroke="#f8fafc" 
                  strokeWidth="1.5"
                  className={`cursor-pointer hover:fill-indigo-400 ${gameState.currentBorough?.id === "bronx" ? "" : "hover:fill-gray-400"}`}
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "bronx")!)}
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="text-sm font-semibold">The Bronx</div>
                <p className="text-xs">Rough and varied, with high crime areas and family neighborhoods</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Borough labels - white text on dark background */}
          <text x="110" y="390" className="text-xs font-semibold fill-white opacity-80">Staten Island</text>
          <text x="280" y="340" className="text-xs font-semibold fill-white opacity-80">Brooklyn</text>
          <text x="370" y="230" className="text-xs font-semibold fill-white opacity-80">Queens</text>
          <text x="230" y="230" className="text-xs font-semibold fill-white opacity-80">Manhattan</text>
          <text x="240" y="120" className="text-xs font-semibold fill-white opacity-80">Bronx</text>
        </svg>
        
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
