import { Borough, MarketItem, DrugItem } from "../types/game";

// Define the boroughs
export const boroughs: Borough[] = [
  {
    id: "bronx",
    name: "The Bronx",
    description: "Rough and varied, with both high crime areas and family neighborhoods.",
    priceFactors: {
      drugs: 0.9
    }
  },
  {
    id: "brooklyn",
    name: "Brooklyn",
    description: "Trendy and diverse with artsy neighborhoods and industrial zones.",
    priceFactors: {
      drugs: 1.0
    }
  },
  {
    id: "manhattan",
    name: "Manhattan",
    description: "The heart of NYC, expensive and heavily policed.",
    priceFactors: {
      drugs: 1.3
    }
  },
  {
    id: "queens",
    name: "Queens",
    description: "Diverse and residential with many cultural communities.",
    priceFactors: {
      drugs: 0.95
    }
  },
  {
    id: "staten_island",
    name: "Staten Island",
    description: "Suburban and isolated, with less police presence.",
    priceFactors: {
      drugs: 0.85
    }
  }
];

// Define the drug items
export const drugs: DrugItem[] = [
  {
    id: "acid",
    name: "Acid",
    category: "drugs",
    description: "Hallucinogenic drug with intense visual effects.",
    basePrice: 3000, // Average of normal range
    volatility: 0.3,
    marketDailyProbability: 0.85,
    dailyEventProbability: 0.1,
    eventDescription: "There's a ton of acid hitting the streets, prices are cheap!",
    noEventParameters: [1000, 4500],
    eventParameters: [200, 700]
  },
  {
    id: "cocaine",
    name: "Cocaine",
    category: "drugs",
    description: "Powerful stimulant with high street value.",
    basePrice: 22500, // Average of normal range
    volatility: 0.4,
    marketDailyProbability: 0.8,
    dailyEventProbability: 0.1,
    eventDescription: "Cops made a massive cocaine bust! Demand is exploding!",
    noEventParameters: [15000, 30000],
    eventParameters: [40000, 60000]
  },
  {
    id: "hashish",
    name: "Hashish",
    category: "drugs",
    description: "Concentrated cannabis extract.",
    basePrice: 750, // Average of normal range
    volatility: 0.25,
    marketDailyProbability: 0.85,
    dailyEventProbability: 0.15,
    eventDescription: "The Marrakesh Express has arrived!",
    noEventParameters: [500, 1000],
    eventParameters: [50, 150]
  },
  {
    id: "heroin",
    name: "Heroin",
    category: "drugs",
    description: "Highly addictive opiate with severe legal consequences.",
    basePrice: 9500, // Average of normal range
    volatility: 0.35,
    marketDailyProbability: 0.8,
    dailyEventProbability: 0.11,
    eventDescription: "Police raided a local lab, prices of heroin are on fire!",
    noEventParameters: [5000, 14000],
    eventParameters: [10000, 14000]
  },
  {
    id: "ecstasy",
    name: "Ecstasy",
    category: "drugs",
    description: "Popular club drug that induces euphoria.",
    basePrice: 65, // Average of normal range
    volatility: 0.3,
    marketDailyProbability: 0.85,
    dailyEventProbability: 0.13,
    eventDescription: "Dealers are loaded on inventory and giving pills like candy!",
    noEventParameters: [30, 100],
    eventParameters: [3, 15]
  },
  {
    id: "smack",
    name: "Smack",
    category: "drugs",
    description: "Street version of heroin, often impure.",
    basePrice: 2900, // Average of normal range
    volatility: 0.3,
    marketDailyProbability: 0.65,
    dailyEventProbability: 0.08,
    eventDescription: "Lots of smack nearby, prices have bottomed out!",
    noEventParameters: [1600, 4200],
    eventParameters: [400, 900]
  },
  {
    id: "opium",
    name: "Opium",
    category: "drugs",
    description: "Raw opiate derived from poppy plants.",
    basePrice: 900, // Average of normal range
    volatility: 0.25,
    marketDailyProbability: 0.7,
    dailyEventProbability: 0.1,
    eventDescription: "Local dealer got raided and people are looking for opium!",
    noEventParameters: [500, 1300],
    eventParameters: [2000, 4000]
  },
  {
    id: "crack",
    name: "Crack",
    category: "drugs",
    description: "Highly addictive form of cocaine.",
    basePrice: 2200, // Average of normal range
    volatility: 0.35,
    marketDailyProbability: 0.65,
    dailyEventProbability: 0.1,
    eventDescription: "Crackheads been rounded up and there's too much supply!",
    noEventParameters: [1400, 3000],
    eventParameters: [400, 800]
  },
  {
    id: "peyote",
    name: "Peyote",
    category: "drugs",
    description: "Natural hallucinogen from cactus.",
    basePrice: 450, // Average of normal range
    volatility: 0.2,
    marketDailyProbability: 0.6,
    dailyEventProbability: 0.08,
    eventDescription: "Lots of peyote just got dropped off, get it while its hot!",
    noEventParameters: [200, 700],
    eventParameters: [50, 100]
  },
  {
    id: "shrooms",
    name: "Shrooms",
    category: "drugs",
    description: "Psychedelic mushrooms with hallucinogenic effects.",
    basePrice: 900, // Average of normal range
    volatility: 0.25,
    marketDailyProbability: 0.65,
    dailyEventProbability: 0.08,
    eventDescription: "People started growing their own, prices are down!",
    noEventParameters: [600, 1200],
    eventParameters: [100, 300]
  },
  {
    id: "speed",
    name: "Speed",
    category: "drugs",
    description: "Amphetamine stimulant, popular in club scenes.",
    basePrice: 150, // Average of normal range
    volatility: 0.4,
    marketDailyProbability: 0.8,
    dailyEventProbability: 0.1,
    eventDescription: "Cops are all over the clubs, the locals need their speed!",
    noEventParameters: [50, 250],
    eventParameters: [400, 700]
  },
  {
    id: "weed",
    name: "Weed",
    category: "drugs",
    description: "Cannabis, most common illicit drug.",
    basePrice: 600, // Average of normal range
    volatility: 0.3,
    marketDailyProbability: 0.85,
    dailyEventProbability: 0.15,
    eventDescription: "Homegrown just harvested! Prices are crashing!",
    noEventParameters: [300, 900],
    eventParameters: [50, 150]
  }
];

// For backward compatibility - convert drugs to MarketItem format
export const items: MarketItem[] = drugs.map(drug => ({
  id: drug.id,
  name: drug.name,
  category: drug.category,
  description: drug.description,
  basePrice: drug.basePrice,
  volatility: drug.volatility
}));
