import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { Borough } from "../../types/game";
import { useAudio } from "../../lib/stores/useAudio";
import { AlertCircle } from "lucide-react";

interface BoroughSelectorProps {
  onBoroughSelected: (borough: Borough) => void;
}

export default function BoroughSelector({ onBoroughSelected }: BoroughSelectorProps) {
  const { gameState } = useGlobalGameState();
  const { playHit } = useAudio();
  const [selectedBorough, setSelectedBorough] = useState<Borough | null>(null);

  // Handle borough selection
  const handleSelect = (borough: Borough) => {
    setSelectedBorough(borough);
  };

  // Handle travel confirmation
  const handleConfirmTravel = () => {
    if (!selectedBorough) return;
    
    playHit();
    onBoroughSelected(selectedBorough);
  };

  return (
    <Card className="w-full max-w-3xl mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Choose Where to Go</span>
          {gameState.currentBorough && (
            <span className="text-sm text-muted-foreground">
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
                  variant={selectedBorough?.id === "bronx" ? "default" : "outline"}
                  className="w-full h-16"
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "bronx")!)}
                >
                  Bronx
                </Button>
              </div>
              <div className="col-start-3 row-start-1">
                <Button 
                  variant={selectedBorough?.id === "queens" ? "default" : "outline"}
                  className="w-full h-16"
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "queens")!)}
                >
                  Queens
                </Button>
              </div>
              <div className="col-start-2 row-start-2">
                <Button 
                  variant={selectedBorough?.id === "manhattan" ? "default" : "outline"}
                  className="w-full h-16"
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "manhattan")!)}
                >
                  Manhattan
                </Button>
              </div>
              <div className="col-start-1 row-start-3">
                <Button 
                  variant={selectedBorough?.id === "brooklyn" ? "default" : "outline"}
                  className="w-full h-16"
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "brooklyn")!)}
                >
                  Brooklyn
                </Button>
              </div>
              <div className="col-start-2 row-start-3">
                <Button 
                  variant={selectedBorough?.id === "staten_island" ? "default" : "outline"}
                  className="w-full h-16"
                  onClick={() => handleSelect(gameState.boroughs.find(b => b.id === "staten_island")!)}
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
                  variant={selectedBorough?.id === borough.id ? "default" : "outline"}
                  className="justify-between text-start h-14"
                  onClick={() => handleSelect(borough)}
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

        {selectedBorough && (
          <div className="mt-4">
            <div className="flex items-start mb-2">
              <h3 className="text-lg font-medium">{selectedBorough.name}</h3>
              {selectedBorough.id === gameState.currentBorough?.id && (
                <span className="ml-2 text-amber-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  You're already here
                </span>
              )}
            </div>
            <p className="text-muted-foreground mb-3">{selectedBorough.description}</p>
            <Button 
              className="w-full"
              disabled={selectedBorough.id === gameState.currentBorough?.id}
              onClick={handleConfirmTravel}
            >
              Travel to {selectedBorough.name}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
