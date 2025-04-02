import { TwitterIcon, Facebook, Instagram, Linkedin, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { toast } from "sonner";

interface SocialShareProps {
  score: number;
  daysPlayed: number;
  achievement?: string;
  growthRate?: number;  // Added compound daily growth rate
}

export default function SocialShare({ score, daysPlayed, achievement, growthRate }: SocialShareProps) {
  // Generate sharing text based on game results
  const getShareText = (): string => {
    let baseText = `I just scored $${score.toLocaleString()} after ${daysPlayed} days in NYC Hustler!`;
    
    // Add compound growth rate if available
    if (growthRate !== undefined) {
      baseText += ` (${growthRate.toFixed(2)}% daily growth)`;
    }
    
    // Add achievement text if available
    if (achievement) {
      baseText += ` ${achievement}`;
    }
    
    // Add website URL
    baseText += " Play at drugwars.replit.app";
    
    return baseText;
  };

  // Generate hashtags for social media
  const getHashtags = (): string => {
    return "NYCHustler,DrugWars,GameAchievement";
  };

  // Use fixed website URL for sharing
  const getWebsiteUrl = (): string => {
    return "https://drugwars.replit.app";
  };

  // Handle Twitter sharing
  const shareOnTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const hashtags = getHashtags();
    const url = encodeURIComponent(getWebsiteUrl());
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtags}&url=${url}`,
      "_blank"
    );
  };

  // Handle Facebook sharing
  const shareOnFacebook = () => {
    const url = encodeURIComponent(getWebsiteUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  // Handle LinkedIn sharing
  const shareOnLinkedIn = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getWebsiteUrl());
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
      "_blank"
    );
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareText())
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy. Please try again.");
      });
  };

  return (
    <div className="flex flex-col space-y-3">
      <p className="text-sm text-muted-foreground mb-1 text-center">Share your achievement:</p>
      <div className="flex space-x-3 justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={shareOnTwitter} 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-[#1DA1F2] hover:text-white transition-colors"
              >
                <TwitterIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on Twitter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={shareOnFacebook} 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-[#4267B2] hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on Facebook</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={shareOnLinkedIn} 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-[#0077B5] hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on LinkedIn</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={copyToClipboard} 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-gray-800 hover:text-white transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="text-xs text-muted-foreground text-center pt-1">
        {getShareText()}
      </div>
    </div>
  );
}