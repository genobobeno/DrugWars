// Game phases
export type GamePhase = 'start' | 'playing' | 'gameover';

// Borough (location) interface
export interface Borough {
  id: string;
  name: string;
  description: string;
  priceFactors: {
    [category: string]: number;
  };
}

// Market item interface
export interface MarketItem {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  volatility: number;
}

// Player inventory item
export interface InventoryItem {
  id: string;
  quantity: number;
  avgPurchasePrice: number;
}

// Transaction record
export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
  day: number;
  borough: string;
}

// Borough visit record
export interface BoroughVisit {
  id: string;
  count: number;
}

// Game event effect
export interface EventEffect {
  type: 'cash' | 'debt' | 'health' | 'inventory';
  value: number;
}

// Game event
export interface GameEvent {
  id: string;
  type: string;
  category: string;
  title: string;
  description: string;
  effect: 'positive' | 'negative' | 'neutral';
  probability: number;
  effects?: EventEffect[];
  impactSummary?: string[];
}

// Game state interface
export interface GameState {
  phase: GamePhase;
  currentDay: number;
  totalDays: number;
  cash: number;
  startingCash: number;
  bank: number;
  bankInterestRate: number;
  debt: number;
  debtInterestRate: number;
  health: number;
  guns: number;
  maxInventorySpace: number;
  currentBorough: Borough | null;
  boroughs: Borough[];
  items: MarketItem[];
  inventory: InventoryItem[];
  currentPrices: Record<string, number>;
  transactionHistory: Transaction[];
  eventHistory: GameEvent[];
  boroughVisits: BoroughVisit[];
  currentEvent?: GameEvent | null;
}
