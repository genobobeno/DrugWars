import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { Landmark, PiggyBank, ArrowRightLeft, TrendingUp, Shield } from "lucide-react";

export default function Banking() {
  const { 
    gameState, 
    depositToBank, 
    withdrawFromBank,
    buyGuns 
  } = useGlobalGameState();
  const { playHit, playSuccess } = useAudio();
  
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [gunsAmount, setGunsAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  // Handle deposit
  const handleDeposit = () => {
    setError(null);
    const amount = parseInt(depositAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    
    try {
      depositToBank(amount);
      setDepositAmount("");
      playSuccess();
    } catch (err: any) {
      setError(err.message);
      playHit();
    }
  };
  
  // Handle withdraw
  const handleWithdraw = () => {
    setError(null);
    const amount = parseInt(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    
    try {
      withdrawFromBank(amount);
      setWithdrawAmount("");
      playSuccess();
    } catch (err: any) {
      setError(err.message);
      playHit();
    }
  };
  
  // Handle buying guns
  const handleBuyGuns = () => {
    setError(null);
    const amount = parseInt(gunsAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    
    try {
      buyGuns(amount);
      setGunsAmount("");
      playSuccess();
    } catch (err: any) {
      setError(err.message);
      playHit();
    }
  };
  
  return (
    <Card className="w-full mb-2">
      <CardHeader className="py-2 px-3">
        <CardTitle className="flex items-center text-xs md:text-sm">
          <Landmark className="mr-1 h-3 w-3 md:h-4 md:w-4" />
          Financial
          <span className="text-[10px] ml-auto">
            Bank: ${gameState?.bank?.toLocaleString() || "0"} ({gameState.bankInterestRate}% daily)
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-2">
        <Tabs defaultValue="banking" className="w-full">
          <TabsList className="w-full mb-2 h-7">
            <TabsTrigger value="banking" className="flex-1 text-[10px] h-7 py-0">
              <PiggyBank className="h-3 w-3 mr-1" />
              <span>Banking</span>
            </TabsTrigger>
            <TabsTrigger value="protection" className="flex-1 text-[10px] h-7 py-0">
              <Shield className="h-3 w-3 mr-1" />
              <span>Protection ({gameState?.guns || 0})</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="banking" className="mt-0">
            <div className="grid grid-cols-2 gap-2">
              {/* Deposit */}
              <div>
                <div className="flex space-x-1">
                  <Input
                    type="number"
                    placeholder="Deposit amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min={1}
                    max={gameState?.cash || 0}
                    className="h-7 text-xs"
                  />
                  <Button 
                    onClick={handleDeposit}
                    disabled={(gameState?.cash || 0) <= 0}
                    size="sm"
                    className="h-7 text-[10px] px-2"
                  >
                    <ArrowRightLeft className="h-3 w-3 mr-1" />
                    Dep
                  </Button>
                </div>
              </div>
              
              {/* Withdraw */}
              <div>
                <div className="flex space-x-1">
                  <Input
                    type="number"
                    placeholder="Withdraw amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min={1}
                    max={gameState?.bank || 0}
                    className="h-7 text-xs"
                  />
                  <Button 
                    onClick={handleWithdraw}
                    disabled={(gameState?.bank || 0) <= 0}
                    size="sm"
                    variant="secondary"
                    className="h-7 text-[10px] px-2"
                  >
                    <ArrowRightLeft className="h-3 w-3 mr-1" />
                    W/D
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="protection" className="mt-0">
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground">
                Guns protect your drugs during events. $500 each.
              </p>
              
              <div className="flex space-x-1">
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={gunsAmount}
                  onChange={(e) => setGunsAmount(e.target.value)}
                  min={1}
                  max={Math.floor((gameState?.cash || 0) / 500)}
                  className="h-7 text-xs"
                />
                <Button 
                  onClick={handleBuyGuns}
                  disabled={(gameState?.cash || 0) < 500}
                  variant="destructive"
                  className="h-7 text-[10px] px-2"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Buy
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Error message */}
        {error && (
          <div className="mt-1 text-[10px] text-destructive">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}