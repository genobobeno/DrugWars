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
      
      <div className="relative h-[400px] w-full overflow-hidden">
        {/* Background Map Image - Using user-provided NYBoroughs.webp */}
        <img 
          src="/images/NYBoroughs.webp" 
          alt="NYC Map"
          className="w-full h-full object-contain bg-gray-900"
        />
        
        {/* Interactive Overlays */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 500 500" className="w-full h-full overlay">
            {/* Staten Island Clickable Area */}
            <polygon 
              points="50,400 80,430 100,410 90,380 60,370" 
              onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "staten_island")!)}
              fill={gameState.currentBorough?.id === "staten_island" ? "rgba(79, 70, 229, 0.6)" : "rgba(255, 255, 255, 0.1)"}
              stroke={gameState.currentBorough?.id === "staten_island" ? "#ffffff" : "#ffffff50"}
              strokeWidth="3"
              className="borough staten-island hover:stroke-white hover:fill-indigo-500/30 transition-all duration-200 cursor-pointer"
            />
            
            {/* Brooklyn Clickable Area */}
            <polygon 
              points="220,400 250,410 270,380 260,350 230,360 210,380" 
              onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "brooklyn")!)}
              fill={gameState.currentBorough?.id === "brooklyn" ? "rgba(79, 70, 229, 0.6)" : "rgba(255, 255, 255, 0.1)"}
              stroke={gameState.currentBorough?.id === "brooklyn" ? "#ffffff" : "#ffffff50"}
              strokeWidth="3"
              className="borough brooklyn hover:stroke-white hover:fill-indigo-500/30 transition-all duration-200 cursor-pointer"
            />
            
            {/* Manhattan Clickable Area */}
            <polygon 
              points="200,200 210,180 220,140 215,130 190,160 185,180" 
              onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "manhattan")!)}
              fill={gameState.currentBorough?.id === "manhattan" ? "rgba(79, 70, 229, 0.6)" : "rgba(255, 255, 255, 0.1)"}
              stroke={gameState.currentBorough?.id === "manhattan" ? "#ffffff" : "#ffffff50"}
              strokeWidth="3"
              className="borough manhattan hover:stroke-white hover:fill-indigo-500/30 transition-all duration-200 cursor-pointer"
            />
            
            {/* Bronx Clickable Area */}
            <polygon 
              points="250,120 270,100 290,90 310,110 300,130 270,140" 
              onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "bronx")!)}
              fill={gameState.currentBorough?.id === "bronx" ? "rgba(79, 70, 229, 0.6)" : "rgba(255, 255, 255, 0.1)"}
              stroke={gameState.currentBorough?.id === "bronx" ? "#ffffff" : "#ffffff50"}
              strokeWidth="3"
              className="borough bronx hover:stroke-white hover:fill-indigo-500/30 transition-all duration-200 cursor-pointer"
            />
            
            {/* Queens Clickable Area */}
            <polygon 
              points="300,200 350,220 370,190 360,160 330,140 310,170" 
              onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "queens")!)}
              fill={gameState.currentBorough?.id === "queens" ? "rgba(79, 70, 229, 0.6)" : "rgba(255, 255, 255, 0.1)"}
              stroke={gameState.currentBorough?.id === "queens" ? "#ffffff" : "#ffffff50"}
              strokeWidth="3"
              className="borough queens hover:stroke-white hover:fill-indigo-500/30 transition-all duration-200 cursor-pointer"
            />
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
