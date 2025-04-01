import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { Badge } from "../ui/badge";

export default function StartScreen() {
  const { startGame } = useGlobalGameState();
  const { toggleMute, isMuted } = useAudio();
  const [showIntro, setShowIntro] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (showIntro) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white">
        <div className="text-4xl md:text-6xl font-bold text-center mb-4 animate-pulse">
          NYC HUSTLER
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
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
      <Card className="w-full max-w-xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold">NYC HUSTLER</CardTitle>
          <CardDescription>
            Buy low, sell high, survive 30 days in the city
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
              You've arrived in New York City with $2,000 cash and a $5,000 debt to a loan shark.
              You have 30 days to make enough money to pay off your debt and become wealthy.
            </p>
            <p>
              Travel between the five boroughs, buying and selling goods to turn a profit.
              But be careful - the streets are dangerous, and the police are always watching.
            </p>
          </TabsContent>
          
          <TabsContent value="howto" className="px-4 py-3">
            <ul className="list-disc list-inside space-y-2">
              <li>Travel between the five boroughs of NYC</li>
              <li>Buy items when prices are low</li>
              <li>Sell items when prices are high</li>
              <li>Be aware of your limited inventory space</li>
              <li>Watch out for random events that can help or hurt you</li>
              <li>Your debt accumulates interest every day</li>
              <li>Survive for 30 days and make as much profit as possible</li>
            </ul>
          </TabsContent>
          
          <TabsContent value="rules" className="px-4 py-3">
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Starting Resources:</h3>
                <p className="text-sm text-muted-foreground">$2,000 cash, $5,000 debt, 100% health, empty inventory</p>
              </div>
              
              <div>
                <h3 className="font-medium">Winning Condition:</h3>
                <p className="text-sm text-muted-foreground">Survive 30 days and end with more money than you started with</p>
              </div>
              
              <div>
                <h3 className="font-medium">Losing Condition:</h3>
                <p className="text-sm text-muted-foreground">Run out of health, or end with less money than you started with</p>
              </div>
              
              <div>
                <h3 className="font-medium">Debt Interest:</h3>
                <p className="text-sm text-muted-foreground">Your debt increases by 5% each day</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex flex-col space-y-3 mt-4">
          <Button 
            size="lg" 
            className="w-full text-lg" 
            onClick={handleStartGame}
          >
            Start Game
          </Button>
          
          <div className="flex justify-between w-full text-xs text-muted-foreground">
            <Badge 
              variant="outline" 
              className="cursor-pointer"
              onClick={toggleMute}
            >
              Sound: {isMuted ? 'Off' : 'On'}
            </Badge>
            <span>v1.0.0</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
