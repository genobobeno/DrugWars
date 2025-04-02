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
                d="M50,570 L75,550 L100,540 L130,530 L160,530 L190,540 L220,560 L240,580 L250,610 L240,640 L220,670 L190,690 L150,700 L110,695 L80,680 L60,650 L50,620 Z" 
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
                d="M310,415 L340,400 L380,395 L420,400 L450,410 L465,430 L480,455 L490,485 L490,515 L475,545 L450,565 L420,580 L380,585 L350,580 L325,565 L310,545 L300,520 L295,495 L295,455 Z" 
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
                d="M360,320 L400,310 L440,305 L480,310 L520,320 L550,335 L580,360 L590,390 L590,420 L580,450 L555,475 L520,490 L480,495 L445,490 L420,475 L400,460 L380,435 L370,410 L360,380 L355,350 Z" 
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
                d="M270,250 L290,245 L305,250 L310,275 L310,310 L305,350 L300,390 L295,430 L290,470 L280,510 L265,520 L250,515 L245,485 L250,450 L255,410 L260,370 L265,330 L270,290 Z" 
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
                d="M260,185 L290,175 L330,170 L370,170 L410,175 L450,185 L480,200 L495,220 L490,245 L470,260 L430,270 L390,275 L350,275 L310,265 L285,250 L270,230 L260,210 Z" 
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
