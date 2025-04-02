import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { Badge } from "../ui/badge";
import { AlertTriangle, VolumeX, Volume2 } from "lucide-react";

export default function StartScreen() {
  const { startGame, restartGame, gameState } = useGlobalGameState();
  const { toggleMute, isMuted } = useAudio();
  const [showIntro, setShowIntro] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000); // Reduced to 3 seconds for faster game starts
    
    return () => clearTimeout(timer);
  }, []);
  
  if (showIntro) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white">
        <div className="text-4xl md:text-6xl font-bold text-center mb-8 animate-bounce">
          NYC DRUG WARS
        </div>
        <div className="text-xl text-center animate-fade-in">
          The streets are waiting...
        </div>
      </div>
    );
  }
  
  const handleStartGame = () => {
    startGame();
  };
  
  const handleRestartGame = () => {
    restartGame();
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
      <Card className="w-full max-w-xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold">NYC DRUG WARS</CardTitle>
          <CardDescription>
            Buy low, sell high, survive 30 days in the city streets
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="story" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="story" className="flex-1">Story</TabsTrigger>
            <TabsTrigger value="howto" className="flex-1">How to Play</TabsTrigger>
            <TabsTrigger value="rules" className="flex-1">Rules</TabsTrigger>
          </TabsList>
          
          <TabsContent value="story" className="px-4 py-3">
            <p className="mb-4">
              You've arrived in New York City with $2,000 cash and a $5,500 debt to a loan shark.
              You have 30 days to make enough money to pay off your debt and become a drug kingpin.
            </p>
            <p className="mb-4">
              Travel between the five boroughs, buying drugs when prices are low and selling them when prices are high.
              Each borough has different price dynamics and drug availability.
            </p>
            <p>
              <span className="flex items-center gap-1 text-amber-500"><AlertTriangle className="h-4 w-4" /> Warning:</span> The streets are dangerous. Police raids, busts, and rival dealers are constant threats. Keep your eyes open for special events that can make or break your business.
            </p>
          </TabsContent>
          
          <TabsContent value="howto" className="px-4 py-3">
            <ul className="list-disc list-inside space-y-2">
              <li>Travel between the five boroughs of NYC</li>
              <li>Buy drugs when prices are low (look for "Cheap!" tags)</li>
              <li>Sell at high prices (look for "HOT!" event indicators)</li>
              <li>Be aware of your limited inventory space</li>
              <li>Not all drugs are available every day in every location</li>
              <li>Special events can dramatically affect drug prices</li>
              <li>Your debt accumulates 10% interest every day</li>
              <li>Bank deposits earn 5% interest daily</li>
              <li>Survive for 30 days and make as much profit as possible</li>
            </ul>
          </TabsContent>
          
          <TabsContent value="rules" className="px-4 py-3">
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Starting Resources:</h3>
                <p className="text-sm text-muted-foreground">$2,000 cash, $5,500 debt, 100% health, empty inventory</p>
              </div>
              
              <div>
                <h3 className="font-medium">Winning Condition:</h3>
                <p className="text-sm text-muted-foreground">Survive 30 days and end with more money than your debt</p>
              </div>
              
              <div>
                <h3 className="font-medium">Losing Condition:</h3>
                <p className="text-sm text-muted-foreground">Run out of health, or end with less money than your debt</p>
              </div>
              
              <div>
                <h3 className="font-medium">Debt Interest:</h3>
                <p className="text-sm text-muted-foreground">Your debt increases by 10% each day</p>
              </div>
              
              <div>
                <h3 className="font-medium">Bank Interest:</h3>
                <p className="text-sm text-muted-foreground">Your bank deposits increase by 5% each day</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex flex-col space-y-3 mt-4">
          {gameState.phase === 'playing' || gameState.phase === 'gameover' ? (
            <div className="space-y-2 w-full">
              <Button 
                size="lg" 
                className="w-full text-lg" 
                onClick={handleStartGame}
              >
                Continue Game
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="w-full text-sm" 
                onClick={handleRestartGame}
              >
                Restart Game (Clear Save)
              </Button>
            </div>
          ) : (
            <Button 
              size="lg" 
              className="w-full text-lg" 
              onClick={handleStartGame}
            >
              Start New Game
            </Button>
          )}
          
          <div className="flex justify-between w-full text-xs text-muted-foreground pt-2">
            <Badge 
              variant="outline" 
              className="cursor-pointer flex items-center gap-1"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              {isMuted ? 'Muted' : 'Sound On'}
            </Badge>
            <span>v2.0.0 - Drug Wars Edition</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
