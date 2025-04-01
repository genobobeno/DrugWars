import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { Borough } from "../../types/game";
import { useAudio } from "../../lib/stores/useAudio";
import { MapPin } from "lucide-react";

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
      
      <div className="relative h-[300px] w-full overflow-hidden">
        {/* Background Map Image */}
        <img 
          src="/images/nyc-map-simple.svg" 
          alt="NYC Map"
          className="w-full h-full object-contain bg-gray-900"
        />
        
        {/* Interactive Overlays */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            {/* Staten Island Clickable Area */}
            <g 
              onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "staten_island")!)}
              className="cursor-pointer"
            >
              <path 
                d="M100,350 L160,390 L140,440 L80,420 Z" 
                fill={gameState.currentBorough?.id === "staten_island" ? "rgba(79, 70, 229, 0.6)" : "rgba(255, 255, 255, 0.1)"}
                stroke={gameState.currentBorough?.id === "staten_island" ? "#ffffff" : "#ffffff50"}
                strokeWidth="3"
                className="hover:stroke-white hover:fill-indigo-500/30 transition-all duration-200"
              />
            </g>
            
            {/* Brooklyn Clickable Area */}
            <g 
              onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "brooklyn")!)}
              className="cursor-pointer"
            >
              <path 
                d="M260,300 L340,280 L360,350 L260,370 Z" 
                fill={gameState.currentBorough?.id === "brooklyn" ? "rgba(79, 70, 229, 0.6)" : "rgba(255, 255, 255, 0.1)"}
                stroke={gameState.currentBorough?.id === "brooklyn" ? "#ffffff" : "#ffffff50"}
                strokeWidth="3"
                className="hover:stroke-white hover:fill-indigo-500/30 transition-all duration-200"
              />
            </g>
            
            {/* Queens Clickable Area */}
            <g 
              onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "queens")!)}
              className="cursor-pointer"
            >
              <path 
                d="M340,200 L420,220 L380,320 L310,280 Z" 
                fill={gameState.currentBorough?.id === "queens" ? "rgba(79, 70, 229, 0.6)" : "rgba(255, 255, 255, 0.1)"}
                stroke={gameState.currentBorough?.id === "queens" ? "#ffffff" : "#ffffff50"}
                strokeWidth="3"
                className="hover:stroke-white hover:fill-indigo-500/30 transition-all duration-200"
              />
            </g>
            
            {/* Manhattan Clickable Area */}
            <g 
              onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "manhattan")!)}
              className="cursor-pointer"
            >
              <path 
                d="M240,180 L260,180 L250,300 L230,300 Z" 
                fill={gameState.currentBorough?.id === "manhattan" ? "rgba(79, 70, 229, 0.6)" : "rgba(255, 255, 255, 0.1)"}
                stroke={gameState.currentBorough?.id === "manhattan" ? "#ffffff" : "#ffffff50"}
                strokeWidth="3"
                className="hover:stroke-white hover:fill-indigo-500/30 transition-all duration-200"
              />
            </g>
            
            {/* Bronx Clickable Area */}
            <g 
              onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "bronx")!)}
              className="cursor-pointer"
            >
              <path 
                d="M240,130 L320,150 L300,200 L240,180 Z" 
                fill={gameState.currentBorough?.id === "bronx" ? "rgba(79, 70, 229, 0.6)" : "rgba(255, 255, 255, 0.1)"}
                stroke={gameState.currentBorough?.id === "bronx" ? "#ffffff" : "#ffffff50"}
                strokeWidth="3"
                className="hover:stroke-white hover:fill-indigo-500/30 transition-all duration-200"
              />
            </g>
          </svg>
        </div>
        
        {/* Borough Info Popups - Show on Hover */}
        <div className="absolute top-2 left-2 px-3 py-1 bg-black/75 text-white rounded text-xs">
          {gameState.currentBorough ? (
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Currently in: <strong>{gameState.currentBorough.name}</strong></span>
            </div>
          ) : (
            <div>Select a borough to travel</div>
          )}
        </div>
        
        {/* Instruction overlay */}
        <div className="absolute bottom-2 right-2 px-3 py-1 bg-black/50 text-white rounded text-xs">
          Click a borough to travel there
        </div>
      </div>
      
      {/* Borough description - only shown when not in unified header mode */}
      {gameState.currentBorough && !headerHidden && (
        <div className="p-3 border-t border-gray-700 bg-gray-800 text-sm">
          <p className="italic text-gray-300">{gameState.currentBorough.description}</p>
        </div>
      )}
      
      {/* Borough description - when in unified header mode */}
      {gameState.currentBorough && headerHidden && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white backdrop-blur-sm p-2 text-xs">
          <p className="font-medium">{gameState.currentBorough.name}</p>
        </div>
      )}
    </div>
  );
}
