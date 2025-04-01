import { useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { CalendarDays } from "lucide-react";

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
    <div className="text-white">
      <div className="flex items-center gap-2 mb-1">
        <CalendarDays className="h-5 w-5 text-yellow-400" />
        <h3 className="text-lg font-medium flex-1">Day {gameState.currentDay}</h3>
        <span className="text-sm opacity-90 bg-gray-800 px-2 py-1 rounded-full">
          {remainingDays} {remainingDays === 1 ? 'day' : 'days'} left
        </span>
      </div>
      
      <div className="relative mb-1">
        <Progress 
          value={progressValue} 
          className="h-2 bg-gray-700 [&>div]:bg-yellow-400" 
        />
      </div>
      
      <p className="text-xs text-gray-400 text-right italic">
        {progressValue < 33 && "Just getting started with your empire"}
        {progressValue >= 33 && progressValue < 66 && "Halfway through your 30-day challenge"}
        {progressValue >= 66 && progressValue < 90 && "Final stretch! Make it count"}
        {progressValue >= 90 && "Last few days! Go big or go home"}
      </p>
    </div>
  );
}
