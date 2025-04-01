import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";

export default function DayCounter() {
  const { gameState } = useGlobalGameState();
  const [progressValue, setProgressValue] = useState(0);
  
  useEffect(() => {
    // Calculate progress percentage
    const progress = (gameState.currentDay / gameState.totalDays) * 100;
    setProgressValue(progress);
  }, [gameState.currentDay, gameState.totalDays]);

  // Format remaining days
  const remainingDays = gameState.totalDays - gameState.currentDay;
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-lg font-medium">Day {gameState.currentDay}</h3>
            <p className="text-sm text-muted-foreground">
              {remainingDays} {remainingDays === 1 ? 'day' : 'days'} remaining
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm">
              {progressValue < 33 && "Just getting started"}
              {progressValue >= 33 && progressValue < 66 && "Halfway there"}
              {progressValue >= 66 && "Final stretch!"}
            </p>
          </div>
        </div>
        
        <Progress value={progressValue} className="h-2" />
      </CardContent>
    </Card>
  );
}
