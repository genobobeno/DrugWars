import { GameState, GameEvent } from "../types/game";

// Define event types and categories
type EventCategory = 'travel' | 'daily' | 'location';

// Police events
const policeEvents: GameEvent[] = [
  {
    id: "police_inspection",
    type: "police",
    category: "travel",
    title: "Police Checkpoint",
    description: "You ran into a police checkpoint while traveling. They searched your belongings but found nothing of interest.",
    effect: "neutral",
    probability: 0.15,
    effects: []
  },
  {
    id: "police_raid",
    type: "police",
    category: "daily",
    title: "Police Raid",
    description: "The police raided the area you were in! You had to dump some items to avoid getting caught.",
    effect: "negative",
    probability: 0.1,
    effects: [
      { type: "inventory", value: -10 }
    ],
    impactSummary: ["Lost some inventory items"]
  },
  {
    id: "police_bribe",
    type: "police",
    category: "travel",
    title: "Corrupt Officer",
    description: "A police officer stopped you and hinted at wanting a bribe. You paid $500 to avoid any trouble.",
    effect: "negative",
    probability: 0.1,
    effects: [
      { type: "cash", value: -500 }
    ],
    impactSummary: ["-$500 cash"]
  }
];

// Police encounter event - special interactive event
const policeEncounterEvents: GameEvent[] = [
  {
    id: "police_encounter",
    type: "police_encounter",
    category: "daily",
    title: "Police Encounter",
    description: "You've encountered the police! What will you do?",
    effect: "neutral",
    probability: 0.15, // 15% daily chance
    // This event will be handled with special UI in EventDisplay component
  }
];

// Market events
const marketEvents: GameEvent[] = [
  {
    id: "market_crash",
    type: "market",
    category: "daily",
    title: "Market Crash",
    description: "Economic news has caused a market panic. Prices for luxury goods have plummeted!",
    effect: "neutral",
    probability: 0.05,
    effects: []
  },
  {
    id: "market_opportunity",
    type: "market",
    category: "daily",
    title: "Hot Tip",
    description: "You overheard a conversation about a shipment shortage. Certain items will be in high demand soon!",
    effect: "positive",
    probability: 0.1,
    effects: []
  },
  {
    id: "market_windfall",
    type: "market",
    category: "daily",
    title: "Unexpected Windfall",
    description: "You found a wallet on the street with $300 cash. Lucky day!",
    effect: "positive",
    probability: 0.08,
    effects: [
      { type: "cash", value: 300 }
    ],
    impactSummary: ["+$300 cash"]
  }
];

// Health events
const healthEvents: GameEvent[] = [
  {
    id: "health_mugging",
    type: "health",
    category: "travel",
    title: "Mugged!",
    description: "You were attacked and robbed while traveling through a dangerous neighborhood.",
    effect: "negative",
    probability: 0.12,
    effects: [
      { type: "health", value: -15 },
      { type: "cash", value: -200 }
    ],
    impactSummary: ["-15 health", "-$200 cash"]
  },
  {
    id: "health_food_poisoning",
    type: "health",
    category: "daily",
    title: "Food Poisoning",
    description: "You ate something bad and got sick. You had to rest for a while.",
    effect: "negative",
    probability: 0.1,
    effects: [
      { type: "health", value: -10 }
    ],
    impactSummary: ["-10 health"]
  },
  {
    id: "health_good_sleep",
    type: "health",
    category: "daily",
    title: "Good Rest",
    description: "You found a safe place to crash and got some much-needed rest.",
    effect: "positive",
    probability: 0.15,
    effects: [
      { type: "health", value: 10 }
    ],
    impactSummary: ["+10 health"]
  }
];

// Inventory events
const inventoryEvents: GameEvent[] = [
  {
    id: "inventory_theft",
    type: "inventory",
    category: "daily",
    title: "Stolen Goods",
    description: "Someone broke into your storage and stole some of your inventory!",
    effect: "negative",
    probability: 0.1,
    effects: [
      { type: "inventory", value: -15 }
    ],
    impactSummary: ["Lost some inventory items"]
  },
  {
    id: "inventory_bonus",
    type: "inventory",
    category: "travel",
    title: "Abandoned Stash",
    description: "You found someone's abandoned stash of goods. Finders keepers!",
    effect: "positive",
    probability: 0.08,
    effects: [
      { type: "cash", value: 400 }
    ],
    impactSummary: ["+$400 cash"]
  }
];

// Debt events
const debtEvents: GameEvent[] = [
  {
    id: "debt_collector",
    type: "debt",
    category: "daily",
    title: "Debt Collector",
    description: "A debt collector tracked you down and demanded an immediate payment.",
    effect: "negative",
    probability: 0.1,
    effects: [
      { type: "cash", value: -300 },
      { type: "debt", value: -200 }
    ],
    impactSummary: ["-$300 cash", "-$200 debt"]
  },
  {
    id: "debt_interest_break",
    type: "debt",
    category: "daily",
    title: "Interest Break",
    description: "Your creditor offered a one-time reduction in your debt as a goodwill gesture.",
    effect: "positive",
    probability: 0.05,
    effects: [
      { type: "debt", value: -500 }
    ],
    impactSummary: ["-$500 debt"]
  }
];

// Cash events
const cashEvents: GameEvent[] = [
  {
    id: "cash_lost_wallet",
    type: "cash",
    category: "travel",
    title: "Lost Wallet",
    description: "You lost your wallet while traveling. Some cash is gone.",
    effect: "negative",
    probability: 0.08,
    effects: [
      { type: "cash", value: -150 }
    ],
    impactSummary: ["-$150 cash"]
  },
  {
    id: "cash_gambling_win",
    type: "cash",
    category: "daily",
    title: "Gambling Win",
    description: "You took a chance at an underground card game and won!",
    effect: "positive",
    probability: 0.07,
    effects: [
      { type: "cash", value: 500 }
    ],
    impactSummary: ["+$500 cash"]
  }
];

// Trenchcoat events - special events to expand inventory capacity
const trenchcoatEvents: GameEvent[] = [
  {
    id: "trenchcoat_offer",
    type: "trenchcoat",
    category: "daily",
    title: "Trenchcoat Upgrade",
    description: "A shady vendor offers you a larger trenchcoat with more pockets. It will increase your inventory capacity by 25 slots.",
    effect: "positive",
    probability: 0.09, // 9% chance of occurring
    // A dynamically calculated price will be applied when the event is triggered
    // This will be handled in the event display component
  }
];

// Gun events - special events to buy guns for protection
const gunEvents: GameEvent[] = [
  {
    id: "gun_offer",
    type: "gun",
    category: "daily",
    title: "Street Weapons Dealer",
    description: "A weapons dealer approaches you offering protection for the streets.",
    effect: "neutral",
    probability: 0.12, // 12% chance of occurring
    // A dynamically calculated price and gun type will be applied when the event is triggered
    // This will be handled in the event display component
  }
];

// Combine all events
const allEvents = [
  ...policeEvents,
  ...policeEncounterEvents,
  ...marketEvents,
  ...healthEvents, 
  ...inventoryEvents,
  ...debtEvents,
  ...cashEvents,
  ...trenchcoatEvents,
  ...gunEvents
];

// Get a random event based on category
export function getRandomEvent(category: EventCategory, gameState: GameState): GameEvent | null {
  // Filter events by category
  let eligibleEvents = allEvents.filter(event => event.category === category);
  
  if (eligibleEvents.length === 0) {
    return null;
  }
  
  // Check if we currently have a gun offer or police encounter
  // (to prevent both happening in the same day)
  const currentEvent = gameState.currentEvent;
  
  if (currentEvent) {
    if (currentEvent.type === 'gun') {
      // If current event is a gun offer, filter out police encounters
      eligibleEvents = eligibleEvents.filter(event => event.type !== 'police_encounter');
    } else if (currentEvent.type === 'police_encounter') {
      // If current event is a police encounter, filter out gun offers
      eligibleEvents = eligibleEvents.filter(event => event.type !== 'gun');
    }
  }
  
  if (eligibleEvents.length === 0) {
    return null;
  }
  
  // Calculate total probability weight
  const totalWeight = eligibleEvents.reduce((sum, event) => sum + event.probability, 0);
  
  // Get a random value between 0 and total weight
  let random = Math.random() * totalWeight;
  
  // Find the event that corresponds to this random value
  for (const event of eligibleEvents) {
    random -= event.probability;
    if (random <= 0) {
      return event;
    }
  }
  
  // Fallback (shouldn't normally reach here)
  return eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
}
