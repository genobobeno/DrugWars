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
        {progressValue >= 90 && progressValue < 100 && "Last few days! Go big or go home"}
      </p>
      
      {/* Final day warning with action button */}
      {remainingDays === 0 && (
        <div className="bg-red-900/50 border border-red-700 rounded-md mt-2 p-2 text-sm text-white">
          <div className="flex justify-between items-center">
            <div>
              <strong className="font-semibold">FINAL DAY!</strong> Sell your inventory to maximize profits before the game ends!
            </div>
            <button 
              onClick={() => {
                // Trigger the same day progression as the borough selection to ensure the game transitions to game over phase
                const { updatePrices, progressDay } = useGlobalGameState.getState();
                updatePrices();
                progressDay();
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors duration-200"
            >
              Let's go count our money!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
