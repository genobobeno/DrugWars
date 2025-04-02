import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "../ui/card";
import { Button } from "../ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { Slider } from "../ui/slider";
import { useGlobalGameState } from "../../lib/stores/useGlobalGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { Landmark, ArrowDown, Wallet, PiggyBank, Banknote } from "lucide-react";

export default function Banking() {
  const { 
    gameState, 
    depositToBank, 
    withdrawFromBank,
    payDebt
  } = useGlobalGameState();
  const { playHit, playSuccess } = useAudio();
  
  // Dialog states
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isPayLoanOpen, setIsPayLoanOpen] = useState(false);
  
  // Amount states
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [payLoanAmount, setPayLoanAmount] = useState<number>(0);
  
  // Open deposit dialog
  const openDepositDialog = () => {
    setDepositAmount(gameState.cash); // Default to all cash
    setIsDepositOpen(true);
  };
  
  // Open withdraw dialog
  const openWithdrawDialog = () => {
    setWithdrawAmount(gameState.bank); // Default to all bank
    setIsWithdrawOpen(true);
  };
  
  // Open pay loan dialog
  const openPayLoanDialog = () => {
    // Default to minimum of cash or debt
    const maxPayment = Math.min(gameState.cash, gameState.debt);
    setPayLoanAmount(maxPayment);
    setIsPayLoanOpen(true);
  };
  
  // Execute deposit
  const handleDeposit = () => {
    try {
      depositToBank(depositAmount);
      playSuccess();
      setIsDepositOpen(false);
    } catch (err) {
      playHit();
    }
  };
  
  // Execute withdraw
  const handleWithdraw = () => {
    try {
      withdrawFromBank(withdrawAmount);
      playSuccess();
      setIsWithdrawOpen(false);
    } catch (err) {
      playHit();
    }
  };
  
  // Execute pay loan
  const handlePayLoan = () => {
    try {
      payDebt(payLoanAmount);
      playSuccess();
      setIsPayLoanOpen(false);
    } catch (err) {
      playHit();
    }
  };
  
  return (
    <>
      <Card className="w-full mb-2">
        <CardHeader className="py-2 px-3">
          <CardTitle className="flex items-center text-xs md:text-sm">
            <Landmark className="mr-1 h-3 w-3 md:h-4 md:w-4" />
            Finances
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-y-2 gap-x-1">
            {/* Row 1: Cash */}
            <div className="flex items-center">
              <Wallet className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">Cash:</span>
            </div>
            <div className="text-xs font-semibold text-right text-green-500">
              ${gameState.cash.toLocaleString()}
            </div>
            <div className="text-right">
              <Button 
                onClick={openDepositDialog}
                disabled={gameState.cash <= 0}
                size="sm"
                className="h-6 text-[10px] w-20"
              >
                Deposit
              </Button>
            </div>
            
            {/* Row 2: Bank */}
            <div className="flex items-center">
              <PiggyBank className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">Bank:</span>
            </div>
            <div className="text-xs font-semibold text-right text-green-500">
              ${gameState.bank.toLocaleString()}
              <span className="block text-[9px] text-muted-foreground">
                ({gameState.bankInterestRate}% interest)
              </span>
            </div>
            <div className="text-right">
              <Button 
                onClick={openWithdrawDialog}
                disabled={gameState.bank <= 0}
                size="sm"
                variant="secondary"
                className="h-6 text-[10px] w-20"
              >
                Withdraw
              </Button>
            </div>
            
            {/* Row 3: Debt */}
            <div className="flex items-center">
              <Banknote className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">Debt:</span>
            </div>
            <div className="text-xs font-semibold text-right text-red-500">
              ${gameState.debt.toLocaleString()}
              <span className="block text-[9px] text-muted-foreground">
                ({gameState.debtInterestRate}% interest)
              </span>
            </div>
            <div className="text-right">
              <Button 
                onClick={openPayLoanDialog}
                disabled={gameState.debt <= 0 || gameState.cash <= 0}
                size="sm"
                variant="destructive"
                className="h-6 text-[10px] w-20"
              >
                Pay Loan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deposit Cash to Bank</DialogTitle>
            <DialogDescription>
              How much cash would you like to deposit?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Amount:</span>
              <span className="font-semibold">${depositAmount.toLocaleString()}</span>
            </div>
            
            <Slider
              value={[depositAmount]}
              min={0}
              max={gameState.cash}
              step={1}
              onValueChange={(values) => setDepositAmount(values[0])}
            />
            
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>$0</span>
              <span>${gameState.cash.toLocaleString()}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDepositOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeposit} disabled={depositAmount <= 0}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw from Bank</DialogTitle>
            <DialogDescription>
              How much would you like to withdraw?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Amount:</span>
              <span className="font-semibold">${withdrawAmount.toLocaleString()}</span>
            </div>
            
            <Slider
              value={[withdrawAmount]}
              min={0}
              max={gameState.bank}
              step={1}
              onValueChange={(values) => setWithdrawAmount(values[0])}
            />
            
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>$0</span>
              <span>${gameState.bank.toLocaleString()}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWithdraw} disabled={withdrawAmount <= 0}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Pay Loan Dialog */}
      <Dialog open={isPayLoanOpen} onOpenChange={setIsPayLoanOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pay Off Loan</DialogTitle>
            <DialogDescription>
              How much would you like to pay?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Amount:</span>
              <span className="font-semibold">${payLoanAmount.toLocaleString()}</span>
            </div>
            
            <Slider
              value={[payLoanAmount]}
              min={0}
              max={Math.min(gameState.cash, gameState.debt)}
              step={1}
              onValueChange={(values) => setPayLoanAmount(values[0])}
            />
            
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>$0</span>
              <span>${Math.min(gameState.cash, gameState.debt).toLocaleString()}</span>
            </div>
            
            <div className="mt-4 text-xs bg-muted p-2 rounded">
              <div className="flex justify-between mb-1">
                <span>Remaining Debt:</span>
                <span>${(gameState.debt - payLoanAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining Cash:</span>
                <span>${(gameState.cash - payLoanAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayLoanOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayLoan} disabled={payLoanAmount <= 0}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}