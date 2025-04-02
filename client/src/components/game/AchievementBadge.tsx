import { Trophy, Medal, Award, Star } from "lucide-react";
import { cn } from "../../lib/utils";

interface AchievementBadgeProps {
  score: number;
  className?: string;
}

export default function AchievementBadge({ score, className }: AchievementBadgeProps) {
  // Determine badge level based on score
  const getBadgeDetails = () => {
    if (score > 25000) {
      return {
        icon: Trophy,
        color: "text-yellow-500",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        ringColor: "ring-yellow-400/50",
        label: "Legend"
      };
    }
    if (score > 15000) {
      return {
        icon: Award,
        color: "text-purple-500",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        ringColor: "ring-purple-400/50",
        label: "Master"
      };
    }
    if (score > 10000) {
      return {
        icon: Medal,
        color: "text-blue-500",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        ringColor: "ring-blue-400/50",
        label: "Pro"
      };
    }
    
    return {
      icon: Star,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      ringColor: "ring-green-400/50",
      label: "Hustler"
    };
  };
  
  const { icon: BadgeIcon, color, bgColor, ringColor, label } = getBadgeDetails();
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ring-1",
      bgColor,
      ringColor,
      className
    )}>
      <BadgeIcon className={cn("w-3 h-3", color)} />
      <span>{label}</span>
    </div>
  );
}