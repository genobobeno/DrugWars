import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { Borough } from "../../types/game";
import { useAudio } from "../../lib/stores/useAudio";
import { MapPin } from "lucide-react";

interface BoroughSelectorProps {
  onBoroughSelected: (borough: Borough) => void;
}

export default function BoroughSelector({ onBoroughSelected }: BoroughSelectorProps) {
  const { gameState } = useGlobalGameState();
  const { playHit } = useAudio();

  // Handle borough selection - now directly trigger travel
  const handleSelect = (borough: Borough) => {
    if (borough.id === gameState.currentBorough?.id) return;
    playHit();
    onBoroughSelected(borough);
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <span>Travel to a Borough</span>
          {gameState.currentBorough && (
            <span className="text-sm font-normal text-muted-foreground">
              (Current: {gameState.currentBorough.name})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="map" className="flex-1">Map View</TabsTrigger>
            <TabsTrigger value="list" className="flex-1">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="mt-4">
            <div className="grid grid-cols-3 gap-3 relative min-h-[200px] bg-muted/20 rounded-lg p-4">
              {/* Stylized NYC Map Layout */}
              <div className="col-start-2 row-start-1">
                <Button 
                  variant={gameState.currentBorough?.id === "bronx" ? "default" : "outline"}
                  className="w-full h-16"
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "bronx")!)}
                  disabled={gameState.currentBorough?.id === "bronx"}
                >
                  Bronx
                </Button>
              </div>
              <div className="col-start-3 row-start-1">
                <Button 
                  variant={gameState.currentBorough?.id === "queens" ? "default" : "outline"}
                  className="w-full h-16"
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "queens")!)}
                  disabled={gameState.currentBorough?.id === "queens"}
                >
                  Queens
                </Button>
              </div>
              <div className="col-start-2 row-start-2">
                <Button 
                  variant={gameState.currentBorough?.id === "manhattan" ? "default" : "outline"}
                  className="w-full h-16"
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "manhattan")!)}
                  disabled={gameState.currentBorough?.id === "manhattan"}
                >
                  Manhattan
                </Button>
              </div>
              <div className="col-start-1 row-start-3">
                <Button 
                  variant={gameState.currentBorough?.id === "brooklyn" ? "default" : "outline"}
                  className="w-full h-16"
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "brooklyn")!)}
                  disabled={gameState.currentBorough?.id === "brooklyn"}
                >
                  Brooklyn
                </Button>
              </div>
              <div className="col-start-2 row-start-3">
                <Button 
                  variant={gameState.currentBorough?.id === "staten_island" ? "default" : "outline"}
                  className="w-full h-16"
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "staten_island")!)}
                  disabled={gameState.currentBorough?.id === "staten_island"}
                >
                  Staten Island
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-4">
            <div className="grid grid-cols-1 gap-2">
              {gameState.boroughs.map((borough) => (
                <Button
                  key={borough.id}
                  variant={gameState.currentBorough?.id === borough.id ? "default" : "outline"}
                  className="justify-between text-start h-14"
                  onClick={() => handleSelect(borough)}
                  disabled={borough.id === gameState.currentBorough?.id}
                >
                  <div className="flex flex-col items-start">
                    <span>{borough.name}</span>
                    <span className="text-xs text-muted-foreground">{borough.description}</span>
                  </div>
                  {borough.id === gameState.currentBorough?.id && (
                    <span className="text-xs bg-primary/20 px-2 py-1 rounded">Current</span>
                  )}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
