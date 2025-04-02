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
          <svg viewBox="0 0 800 800" className="w-full h-full">
            {/* Staten Island Clickable Area */}
            <g 
              onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "staten_island")!)}
              className="cursor-pointer"
            >
              <path 
                d="M140,500 L170,470 L210,480 L250,500 L280,530 L280,570 L260,600 L230,620 L180,640 L150,630 L130,600 L120,560 Z" 
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
                d="M330,380 L355,370 L375,380 L410,375 L430,380 L450,385 L470,400 L485,425 L490,450 L480,480 L460,510 L430,525 L390,530 L355,520 L330,500 L315,470 L320,430 L325,400 Z" 
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
                d="M370,300 L400,280 L440,270 L470,275 L510,290 L540,320 L550,350 L545,380 L530,410 L500,430 L470,435 L440,430 L410,410 L390,390 L380,360 L375,330 Z" 
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
                d="M320,270 L335,260 L350,260 L355,280 L355,310 L350,340 L345,370 L340,400 L335,430 L325,450 L310,450 L305,420 L310,380 L315,340 L315,300 Z" 
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
                d="M310,230 L330,220 L355,215 L380,210 L410,210 L440,220 L460,230 L455,255 L440,270 L410,270 L385,275 L360,280 L340,280 L325,270 L315,250 Z" 
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
