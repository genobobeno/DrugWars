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
    <Card className="w-full mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Landmark className="h-5 w-5" />
          <span>Financial Management</span>
        </CardTitle>
        <CardDescription>
          Deposit for {gameState.bankInterestRate}% daily interest or withdraw your funds
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="banking" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="banking" className="flex-1">
              <PiggyBank className="h-4 w-4 mr-1" />
              <span>Banking</span>
            </TabsTrigger>
            <TabsTrigger value="protection" className="flex-1">
              <Shield className="h-4 w-4 mr-1" />
              <span>Protection</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="banking">
            <div className="grid grid-cols-2 gap-4">
              {/* Deposit */}
              <div className="space-y-2">
                <div className="font-medium text-sm">Deposit Cash</div>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min={1}
                    max={gameState?.cash || 0}
                  />
                  <Button 
                    onClick={handleDeposit}
                    disabled={(gameState?.cash || 0) <= 0}
                    size="sm"
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-1" />
                    Deposit
                  </Button>
                </div>
              </div>
              
              {/* Withdraw */}
              <div className="space-y-2">
                <div className="font-medium text-sm">Withdraw Cash</div>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min={1}
                    max={gameState?.bank || 0}
                  />
                  <Button 
                    onClick={handleWithdraw}
                    disabled={(gameState?.bank || 0) <= 0}
                    size="sm"
                    variant="secondary"
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-1" />
                    Withdraw
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-3 bg-muted/20 p-3 rounded-md">
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <PiggyBank className="h-4 w-4 mr-1" />
                  <span>Current Balance</span>
                </div>
                <div className="font-medium">${gameState?.bank?.toLocaleString() || "0"}</div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Daily Interest Rate</span>
                </div>
                <div>{gameState?.bankInterestRate || 5}%</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="protection">
            <div className="space-y-3">
              <div className="font-medium text-sm">Buy Guns for Protection</div>
              <p className="text-xs text-muted-foreground">
                Guns can help protect your inventory during encounters and random events.
                Each gun costs $500 and increases your survival chances.
              </p>
              
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={gunsAmount}
                  onChange={(e) => setGunsAmount(e.target.value)}
                  min={1}
                  max={Math.floor((gameState?.cash || 0) / 500)}
                />
                <Button 
                  onClick={handleBuyGuns}
                  disabled={(gameState?.cash || 0) < 500}
                  variant="destructive"
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Buy Guns
                </Button>
              </div>
              
              <div className="mt-2 bg-muted/20 p-3 rounded-md">
                <div className="flex justify-between text-sm">
                  <div>Current Guns</div>
                  <div className="font-medium">{gameState?.guns || 0}</div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <div>Cost per Gun</div>
                  <div>$500</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Error message */}
        {error && (
          <div className="mt-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}