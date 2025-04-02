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
                updatedState.cash = Math.max(0, updatedState.cash + effect.value);
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
                // Remove random items if effect is negative
                if (effect.value < 0 && updatedState.inventory.length > 0) {
                  const totalItems = updatedState.inventory.reduce((sum, item) => sum + item.quantity, 0);
                  const itemsToRemove = Math.min(Math.abs(effect.value), totalItems);
                  
                  if (itemsToRemove > 0) {
                    // Choose a random item to remove from
                    const itemIndex = Math.floor(Math.random() * updatedState.inventory.length);
                    const item = updatedState.inventory[itemIndex];
                    
                    // Remove items
                    const newQuantity = item.quantity - itemsToRemove;
                    
                    if (newQuantity <= 0) {
                      // Remove item completely
                      updatedState.inventory = updatedState.inventory.filter((_, idx) => idx !== itemIndex);
                    } else {
                      // Reduce quantity
                      updatedState.inventory = updatedState.inventory.map((item, idx) => {
                        if (idx === itemIndex) {
                          return { ...item, quantity: newQuantity };
                        }
                        return item;
                      });
                    }
                  }
                }
                break;
            }
          }
        }
        
        // Add current day to the event
        const eventWithDay = {
          ...event,
          day: updatedState.currentDay
        };
        
        // Add event to history and update current event
        const finalState = {
          ...updatedState,
          currentEvent: eventWithDay,
          eventHistory: [...updatedState.eventHistory, eventWithDay]
        };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, finalState);
        
        return { 
          gameState: finalState,
          currentEvent: eventWithDay
        };
      });
    },
    
    // Clear current event
    clearGameEvent: () => {
      set(state => {
        const updatedGameState = {
          ...state.gameState,
          currentEvent: null
        };
        
        // Save game state
        setLocalStorage(STORAGE_KEY, updatedGameState);
        
        return { 
          gameState: updatedGameState,
          currentEvent: null
        };
      });
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
    
    // Withdraw from bank to cash
    withdrawFromBank: (amount: number) => {
      set(state => {
        const { gameState } = state;
        
        // Check if bank has enough money
        if (gameState.bank < amount) {
          throw new Error("Not enough money in the bank");
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
    
    // Pay off debt
    payDebt: (amount: number) => {
      set(state => {
        const { gameState } = state;
        
        // Check if player has enough cash
        if (gameState.cash < amount) {
          throw new Error("Not enough cash to pay debt");
        }
        
        // Check if payment is not greater than debt
        if (amount > gameState.debt) {
          throw new Error("Payment amount exceeds debt");
        }
        
        const updatedGameState = {
          ...gameState,
          cash: gameState.cash - amount,
          debt: gameState.debt - amount
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
    }
  };
});
