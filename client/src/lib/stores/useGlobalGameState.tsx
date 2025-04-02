import { create } from 'zustand';
import { generatePrices } from '../priceGenerator';
import { GameState, Borough, GameEvent, MarketItem, InventoryItem, Transaction, GamePhase } from '../../types/game';
import { getLocalStorage, setLocalStorage } from '../utils';
import { boroughs, items, drugs } from '../gameData';

const STORAGE_KEY = 'nyc-hustler-game-state';

// Default initial game state
const initialGameState: GameState = {
  phase: 'start' as const,
  currentDay: 1,
  totalDays: 30,
  cash: 2000,
  startingCash: 2000,
  bank: 0,
  bankInterestRate: 5,
  debt: 5500,
  debtInterestRate: 10,
  health: 100,
  guns: 0,
  maxInventorySpace: 100,
  currentBorough: null,
  boroughs: boroughs,
  items: items,
  inventory: [],
  currentPrices: {},
  transactionHistory: [],
  eventHistory: [],
  boroughVisits: boroughs.map(borough => ({ id: borough.id, count: 0 })),
  currentEvent: null
};

interface GameStateStore {
  gameState: GameState;
  currentEvent: GameEvent | null;
  initGame: () => void;
  startGame: () => void;
  restartGame: () => void;
  setCurrentBorough: (borough: Borough) => void;
  buyItem: (itemId: string, quantity: number, price: number) => void;
  sellItem: (itemId: string, quantity: number, price: number) => void;
  updatePrices: () => void;
  progressDay: () => void;
  setGameEvent: (event: GameEvent) => void;
  clearGameEvent: () => void;
  depositToBank: (amount: number) => void;
  withdrawFromBank: (amount: number) => void;
  payDebt: (amount: number) => void;
  buyGuns: (quantity: number, pricePerGun?: number) => void;
  updateHealth: (amount: number) => void;
  visitPrivateDoctor: (cost: number) => void;
  updateCash: (amount: number) => void;
  updateInventorySpace: (amount: number) => void;
  addToEventHistory: (event: GameEvent) => void;
}

// Create Zustand store with all game logic
export const useGlobalGameState = create<GameStateStore>((set, get) => {
  return {
    gameState: initialGameState,
    currentEvent: null,
    
    // Initialize the game
    initGame: () => {
      // Check for forced reset first (for development purposes)
      const urlParams = new URLSearchParams(window.location.search);
      const forceReset = urlParams.get('reset') === 'true';
      
      if (forceReset) {
        console.log("Forced reset detected. Clearing game state.");
        localStorage.removeItem(STORAGE_KEY);
        window.history.replaceState({}, document.title, window.location.pathname); // Remove query param
        
        // Generate fresh prices
        const initialPrices = generatePrices(items, null);
        set({
          gameState: {
            ...initialGameState,
            currentPrices: initialPrices
          },
          currentEvent: null
        });
        return;
      }
      
      // Try to load saved game
      const savedState = getLocalStorage(STORAGE_KEY);
      
      if (savedState) {
        // Verify the saved state has all necessary properties
        if (savedState.items && savedState.currentPrices) {
          set({ gameState: savedState });
        } else {
          // If saved state is corrupted, start fresh
          console.log("Saved state is missing properties. Starting fresh.");
          localStorage.removeItem(STORAGE_KEY);
          const initialPrices = generatePrices(items, null);
          set({
            gameState: {
              ...initialGameState,
              currentPrices: initialPrices
            }
          });
        }
      } else {
        // Generate initial prices
        const initialPrices = generatePrices(items, null);
        set(state => ({
          gameState: {
            ...state.gameState,
            currentPrices: initialPrices
          }
        }));
      }
    },
    
    // Start a new game
    startGame: () => {
      // Generate initial prices with drug-specific logic
      const initialPrices = generatePrices(items, null);
      
      set(state => ({
        gameState: {
          ...initialGameState,
          phase: 'playing' as const,
          currentPrices: initialPrices
        }
      }));

      // Save game state
      const newState = get().gameState;
      if (newState.phase !== 'start') {
        setLocalStorage(STORAGE_KEY, newState);
      }
    },
    
    // Restart the game
    restartGame: () => {
      // Clear all stored game data
      localStorage.removeItem(STORAGE_KEY);
      
      // Generate drug-specific prices
      const initialPrices = generatePrices(items, null);
      
      // Set completely new state to ensure no old data remains
      set({
        gameState: {
          ...initialGameState,
          phase: 'playing' as const,
          items: items, // Ensure we're using the new drug items
          currentPrices: initialPrices,
          inventory: [] // Explicitly clear inventory
        },
        currentEvent: null
      });
      
      // Save the fresh state
      setLocalStorage(STORAGE_KEY, get().gameState);
    },
    
    // Set current borough
    setCurrentBorough: (borough: Borough) => {
      set(state => {
        // Update borough visit count
        const updatedVisits = state.gameState.boroughVisits.map(visit => {
          if (visit.id === borough.id) {
            return { ...visit, count: visit.count + 1 };
          }
          return visit;
        });
        
        const updatedState = {
          gameState: {
            ...state.gameState,
            currentBorough: borough,
            boroughVisits: updatedVisits
          }
        };

        // Save game state
        setLocalStorage(STORAGE_KEY, updatedState.gameState);
        
        return updatedState;
      });
    },
    
    // Buy an item
    buyItem: (itemId: string, quantity: number, price: number) => {
      set(state => {
        const { gameState } = state;
        
        // Check if player has enough money
        if (gameState.cash < price * quantity) {
          throw new Error("Not enough cash to complete this purchase");
        }
        
        // Check if player has enough inventory space
        const currentTotalItems = gameState.inventory.reduce((sum, item) => sum + item.quantity, 0);
        if (currentTotalItems + quantity > gameState.maxInventorySpace) {
          throw new Error("Not enough inventory space");
        }
        
        // Update inventory
        let updatedInventory = [...gameState.inventory];
        const existingItemIndex = updatedInventory.findIndex(item => item.id === itemId);
        
        if (existingItemIndex !== -1) {
          // Update existing item
          const existingItem = updatedInventory[existingItemIndex];
          const newTotalQuantity = existingItem.quantity + quantity;
          const newTotalCost = existingItem.avgPurchasePrice * existingItem.quantity + price * quantity;
          const newAvgPrice = Math.round(newTotalCost / newTotalQuantity);
          
          updatedInventory[existingItemIndex] = {
            ...existingItem,
            quantity: newTotalQuantity,
            avgPurchasePrice: newAvgPrice
          };
        } else {
          // Add new item
          updatedInventory.push({
            id: itemId,
            quantity,
            avgPurchasePrice: Math.round(price)
          });
        }
        
        // Record transaction
        const transaction: Transaction = {
          id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type: 'buy',
          itemId,
          itemName: gameState.items.find(item => item.id === itemId)?.name || 'Unknown Item',
          quantity,
          price,
          total: price * quantity,
          day: gameState.currentDay,
          borough: gameState.currentBorough?.id || 'unknown'
        };
        
        const updatedGameState = {
          ...gameState,
          cash: gameState.cash - (price * quantity),
          inventory: updatedInventory,
          transactionHistory: [...gameState.transactionHistory, transaction]
        };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        return { gameState: updatedGameState };
      });
    },
    
    // Sell an item
    sellItem: (itemId: string, quantity: number, price: number) => {
      set(state => {
        const { gameState } = state;
        
        // Check if player has enough of this item
        const inventoryItem = gameState.inventory.find(item => item.id === itemId);
        if (!inventoryItem || inventoryItem.quantity < quantity) {
          throw new Error("You don't have enough of this item to sell");
        }
        
        // Update inventory
        const updatedInventory = gameState.inventory.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              quantity: item.quantity - quantity
            };
          }
          return item;
        }).filter(item => item.quantity > 0); // Remove items with 0 quantity
        
        // Record transaction
        const transaction: Transaction = {
          id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type: 'sell',
          itemId,
          itemName: gameState.items.find(item => item.id === itemId)?.name || 'Unknown Item',
          quantity,
          price,
          total: price * quantity,
          day: gameState.currentDay,
          borough: gameState.currentBorough?.id || 'unknown'
        };
        
        const updatedGameState = {
          ...gameState,
          cash: gameState.cash + (price * quantity),
          inventory: updatedInventory,
          transactionHistory: [...gameState.transactionHistory, transaction]
        };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        return { gameState: updatedGameState };
      });
    },
    
    // Update prices for items
    updatePrices: () => {
      set(state => {
        const { gameState } = state;
        const newPrices = generatePrices(gameState.items, gameState.currentBorough);
        
        const updatedGameState = {
          ...gameState,
          currentPrices: newPrices
        };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        return { gameState: updatedGameState };
      });
    },
    
    // Progress to the next day
    progressDay: () => {
      set(state => {
        const { gameState } = state;
        const nextDay = gameState.currentDay + 1;
        
        // Apply debt interest (rounded to nearest dollar)
        const newDebt = Math.round(gameState.debt * (1 + gameState.debtInterestRate / 100));
        
        // Apply bank interest (rounded to nearest dollar)
        const newBank = Math.round(gameState.bank * (1 + gameState.bankInterestRate / 100));
        
        // Check if game is over
        const updatedGameState = nextDay > gameState.totalDays
          ? { ...gameState, phase: 'gameover' as const, debt: newDebt, bank: newBank }
          : { ...gameState, currentDay: nextDay, debt: newDebt, bank: newBank };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        return { gameState: updatedGameState };
      });
    },
    
    // Set a game event
    setGameEvent: (event: GameEvent) => {
      set(state => {
        let updatedState = { ...state.gameState };
        
        // Apply event effects to game state
        if (event.effects) {
          for (const effect of event.effects) {
            switch (effect.type) {
              case 'cash':
                // Handle different cash effect scenarios
                if (effect.value < 0) {
                  let deductionAmount = Math.abs(effect.value);
                  
                  // Special case: value is -1 means percentage-based reduction
                  if (deductionAmount === 1) {
                    // For mugging: 10-40% of cash
                    if (event.id === "health_mugging") {
                      const percentage = 10 + Math.floor(Math.random() * 31); // 10-40%
                      deductionAmount = Math.floor(updatedState.cash * percentage / 100);
                      
                      // Update the event description with only the dollar amount
                      event.description = `You were attacked and robbed while traveling through a dangerous neighborhood. They took $${deductionAmount}.`;
                      event.impactSummary = ["-15 health", `-$${deductionAmount} cash`];
                    }
                    // For lost wallet: 15-25% of cash
                    else if (event.id === "cash_lost_wallet") {
                      const percentage = 15 + Math.floor(Math.random() * 11); // 15-25%
                      deductionAmount = Math.floor(updatedState.cash * percentage / 100);
                      
                      // Update the event description with only the dollar amount
                      event.description = `You lost your wallet while traveling. You lost $${deductionAmount}.`;
                      event.impactSummary = [`-$${deductionAmount} cash`];
                    }
                    // For mugged: 20-40% of cash
                    else if (event.id === "cash_mugged") {
                      const percentage = 20 + Math.floor(Math.random() * 21); // 20-40%
                      deductionAmount = Math.floor(updatedState.cash * percentage / 100);
                      
                      // Update the event description with only the dollar amount
                      event.description = `You were mugged at knifepoint in a dark alley. They took $${deductionAmount}.`;
                      event.impactSummary = [`-$${deductionAmount} cash`];
                    }
                  } 
                  // For fixed amount events like police bribes, debt collectors, cap at available cash
                  else if (event.id === "police_bribe" || event.id === "debt_collector") {
                    deductionAmount = Math.min(deductionAmount, updatedState.cash);
                    
                    // Update descriptions for these events
                    if (event.id === "police_bribe") {
                      event.description = `A police officer stopped you and demanded a small bribe to avoid any trouble. You paid $${deductionAmount}.`;
                      event.impactSummary = [`-$${deductionAmount} cash`];
                    }
                    else if (event.id === "debt_collector") {
                      event.description = `A debt collector tracked you down and demanded an immediate payment of $${deductionAmount}. This reduces your debt by $300.`;
                      event.impactSummary = [`-$${deductionAmount} cash`, "-$300 debt"];
                    }
                  }
                  
                  // Apply the deduction
                  updatedState.cash = Math.max(0, updatedState.cash - deductionAmount);
                } else {
                  // For positive cash effects, just add the amount
                  updatedState.cash += effect.value;
                }
                break;
              case 'debt':
                updatedState.debt = Math.max(0, updatedState.debt + effect.value);
                break;
              case 'health':
                updatedState.health = Math.min(100, Math.max(0, updatedState.health + effect.value));
                break;
              case 'maxInventorySpace':
                // Add to max inventory space
                updatedState.maxInventorySpace += effect.value;
                break;
              case 'guns':
                // Add or remove guns
                updatedState.guns = Math.max(0, updatedState.guns + effect.value);
                break;
              case 'inventory':
                // Remove inventory items if effect is negative
                if (effect.value < 0 && updatedState.inventory.length > 0) {
                  // Apply inventory loss to a random item, or all items if value is -100
                  const isLosingAllItems = effect.value === -100;
                  
                  if (isLosingAllItems) {
                    // Lose all inventory
                    updatedState.inventory = [];
                    
                    // Add description that all inventory was lost
                    if (event.impactSummary) {
                      event.impactSummary.push("-All drugs");
                    } else {
                      event.impactSummary = ["-All drugs"];
                    }
                  } else {
                    // Choose a random item to lose some quantity
                    const randomItemIndex = Math.floor(Math.random() * updatedState.inventory.length);
                    const randomItem = updatedState.inventory[randomItemIndex];
                    
                    // Calculate how much to lose (5-30% of current quantity)
                    const lossPercentage = 5 + Math.floor(Math.random() * 26); // 5-30%
                    let lossAmount = Math.max(1, Math.floor(randomItem.quantity * (lossPercentage / 100)));
                    
                    // Ensure we don't lose more than we have
                    lossAmount = Math.min(lossAmount, randomItem.quantity);
                    
                    // Update inventory
                    const updatedInventory = [...updatedState.inventory];
                    if (lossAmount >= randomItem.quantity) {
                      // Remove item entirely if all is lost
                      updatedInventory.splice(randomItemIndex, 1);
                    } else {
                      // Reduce quantity
                      updatedInventory[randomItemIndex] = {
                        ...randomItem,
                        quantity: randomItem.quantity - lossAmount
                      };
                    }
                    
                    updatedState.inventory = updatedInventory;
                    
                    // Add the loss to the impact summary without specific percentages
                    const itemName = updatedState.items.find(item => item.id === randomItem.id)?.name || 'Unknown Item';
                    if (event.impactSummary) {
                      event.impactSummary.push(`-Some ${itemName}`);
                    } else {
                      event.impactSummary = [`-Some ${itemName}`];
                    }
                  }
                }
                break;
            }
          }
        }
        
        // Save the updated state
        setLocalStorage(STORAGE_KEY, updatedState);
        
        // Set the current event
        return { gameState: updatedState, currentEvent: event };
      });
    },
    
    // Clear a game event
    clearGameEvent: () => {
      set({ currentEvent: null });
    },
    
    // Deposit cash to bank
    depositToBank: (amount: number) => {
      set(state => {
        const { gameState } = state;
        
        // Check if player has enough cash
        if (gameState.cash < amount) {
          throw new Error("Not enough cash to deposit");
        }
        
        const updatedGameState = {
          ...gameState,
          cash: gameState.cash - amount,
          bank: gameState.bank + amount
        };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        return { gameState: updatedGameState };
      });
    },
    
    // Withdraw cash from bank
    withdrawFromBank: (amount: number) => {
      set(state => {
        const { gameState } = state;
        
        // Check if player has enough in the bank
        if (gameState.bank < amount) {
          throw new Error("Not enough money in the bank to withdraw");
        }
        
        const updatedGameState = {
          ...gameState,
          cash: gameState.cash + amount,
          bank: gameState.bank - amount
        };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        return { gameState: updatedGameState };
      });
    },
    
    // Pay debt
    payDebt: (amount: number) => {
      set(state => {
        const { gameState } = state;
        
        // Check if player has enough cash
        if (gameState.cash < amount) {
          throw new Error("Not enough cash to pay debt");
        }
        
        // Check if amount is more than debt
        const actualPayment = Math.min(amount, gameState.debt);
        
        const updatedGameState = {
          ...gameState,
          cash: gameState.cash - actualPayment,
          debt: gameState.debt - actualPayment
        };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        return { gameState: updatedGameState };
      });
    },
    
    // Buy guns
    buyGuns: (quantity: number, pricePerGun?: number) => {
      set(state => {
        const { gameState } = state;
        
        // Default price is $500 if not specified
        const unitPrice = pricePerGun || 500;
        const cost = quantity * unitPrice;
        
        // Check if player has enough cash
        if (gameState.cash < cost) {
          throw new Error("Not enough cash to buy guns");
        }
        
        const updatedGameState = {
          ...gameState,
          cash: gameState.cash - cost,
          guns: gameState.guns + quantity
        };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        return { gameState: updatedGameState };
      });
    },
    
    // Update health value
    updateHealth: (amount: number) => {
      set(state => {
        const { gameState } = state;
        
        // Ensure health stays between 0 and 100
        const newHealth = Math.min(100, Math.max(0, gameState.health + amount));
        
        const updatedGameState = {
          ...gameState,
          health: newHealth
        };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        return { gameState: updatedGameState };
      });
    },
    
    // Visit private doctor after winning a police gunfight
    visitPrivateDoctor: (cost: number) => {
      set(state => {
        const { gameState } = state;
        
        // Check if player has enough money
        if (gameState.cash < cost) {
          throw new Error("Not enough cash to pay the doctor");
        }
        
        // Update health to 100%, deduct cash, progress day unless it's day 30
        const shouldProgressDay = gameState.currentDay < gameState.totalDays;
        
        let updatedGameState = {
          ...gameState,
          cash: gameState.cash - cost,
          health: 100
        };
        
        // Progress day if not the final day
        if (shouldProgressDay) {
          const nextDay = gameState.currentDay + 1;
          
          // Apply debt interest (rounded to nearest dollar)
          const newDebt = Math.round(gameState.debt * (1 + gameState.debtInterestRate / 100));
          
          // Apply bank interest (rounded to nearest dollar)
          const newBank = Math.round(gameState.bank * (1 + gameState.bankInterestRate / 100));
          
          updatedGameState = {
            ...updatedGameState,
            currentDay: nextDay,
            debt: newDebt,
            bank: newBank
          };
        }
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        return { gameState: updatedGameState };
      });
    },
    
    // Update cash amount
    updateCash: (amount: number) => {
      set(state => {
        const { gameState } = state;
        const updatedCash = Math.max(0, gameState.cash + amount);
        
        const updatedGameState = {
          ...gameState,
          cash: updatedCash
        };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        return { gameState: updatedGameState };
      });
    },
    
    // Update inventory space
    updateInventorySpace: (amount: number) => {
      set(state => {
        const { gameState } = state;
        const updatedSpace = gameState.maxInventorySpace + amount;
        
        const updatedGameState = {
          ...gameState,
          maxInventorySpace: updatedSpace
        };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        console.log(`Updated inventory space: ${gameState.maxInventorySpace} → ${updatedSpace}`);
        
        return { gameState: updatedGameState };
      });
    },
    
    // Add an event to history
    addToEventHistory: (event: GameEvent) => {
      set(state => {
        const { gameState } = state;
        
        // Check if event is already in history
        if (gameState.eventHistory.some(e => e.id === event.id)) {
          return { gameState };
        }
        
        const updatedGameState = {
          ...gameState,
          eventHistory: [...gameState.eventHistory, event]
        };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        return { gameState: updatedGameState };
      });
    }
  };
});