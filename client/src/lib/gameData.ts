import { Borough, MarketItem, DrugItem, NPCCharacter, NPCDeal } from "../types/game";

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
    id: "experimental",
    name: "Experimental Drug",
    category: "drugs",
    description: "A mysterious experimental compound with unpredictable pricing.",
    basePrice: 2000, // Base price to start from
    volatility: 0.5, // Higher volatility for more random pricing
    marketDailyProbability: 0.7, // 70% chance to appear in markets
    dailyEventProbability: 0.2, // Higher chance of price events
    eventDescription: "Word of this new experimental drug is spreading rapidly!",
    noEventParameters: [600, 2000], // 30% to 100% of base price
    eventParameters: [2000, 10000] // 100% to 500% of base price
  },
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
    eventParameters: [40000, 130000]
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
    eventParameters: [25000, 50000]
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

// Define NPC characters with special deals
export const npcCharacters: NPCCharacter[] = [
  {
    id: "mad_scientist",
    name: "Mad Scientist",
    description: "A reclusive chemist who specializes in experimental compounds of dubious origin.",
    personality: "Eccentric and brilliant, speaks rapidly about chemical formulas and neural pathways.",
    favoredBoroughs: ["manhattan", "bronx"],
    probability: 0.15,
    deals: [
      {
        id: "scientist_experimental_deal",
        type: "sell",
        itemId: "experimental",
        itemName: "Experimental Drug",
        quantity: 10,
        price: 1500, // Discount
        description: "Fresh from the lab! This batch has... unique properties. Not FDA approved, obviously. Limited supply - 10 units at a special price."
      }
    ]
  },
  {
    id: "jimmy_stash",
    name: "Jimmy Stash",
    description: "A fidgety young dealer from Queens with connections to premium stash houses.",
    personality: "Nervous but business-minded, always looking for the next big deal.",
    favoredBoroughs: ["queens", "brooklyn"],
    probability: 0.15,
    deals: [
      {
        id: "jimmy_bulk_weed",
        type: "sell",
        itemId: "weed",
        itemName: "Premium Weed",
        quantity: 30,
        price: 400, // Discount from normal price
        description: "I got some premium grade stuff, much better than street quality. I'll give you 30 units for a special price."
      },
      {
        id: "jimmy_buy_cocaine",
        type: "buy",
        itemId: "cocaine",
        itemName: "Cocaine",
        price: 32000, // Higher than normal price
        description: "My uptown clients are desperate for quality blow. I'll pay top dollar if you have any to sell."
      }
    ]
  },
  {
    id: "big_tony",
    name: "Big Tony",
    description: "A well-connected mob associate who deals in high-value transactions.",
    personality: "Calm, calculated, and intimidating. Speaks quietly but carries weight.",
    favoredBoroughs: ["manhattan", "staten_island"],
    probability: 0.12,
    deals: [
      {
        id: "tony_heroin_deal",
        type: "sell",
        itemId: "heroin",
        itemName: "Pure Heroin",
        quantity: 15,
        price: 7500, // Discount
        description: "Just got a shipment of the pure stuff. Premium quality, no cuts. I'll let 15 units go at a special price because I like your style."
      },
      {
        id: "tony_protection",
        type: "special",
        specialEffect: {
          type: "health",
          value: 25
        },
        description: "I can offer you some protection in these streets. For $1000, my boys will watch your back, reducing your chances of getting hurt."
      },
      {
        id: "tony_debt_reduction",
        type: "special",
        specialEffect: {
          type: "debt",
          value: -1000
        },
        description: "I know some people who owe you money. For $2000 cash, I can get them to reduce your debt by $3000."
      }
    ]
  },
  {
    id: "shadow",
    name: "Shadow",
    description: "A mysterious figure who specializes in rare psychedelics and underground connections.",
    personality: "Speaks in riddles and has an air of mystique. Highly knowledgeable about underground markets.",
    favoredBoroughs: ["brooklyn", "bronx"],
    probability: 0.1,
    deals: [
      {
        id: "shadow_acid_deal",
        type: "sell",
        itemId: "acid",
        itemName: "Pure LSD",
        quantity: 25,
        price: 2000, // Discount
        description: "These tabs came from the best chemist on the west coast. Much cleaner trip than the street stuff. I can let 25 units go for a special price."
      },
      {
        id: "shadow_peyote_deal",
        type: "sell",
        itemId: "peyote",
        itemName: "Rare Peyote",
        quantity: 15,
        price: 300, // Discount
        description: "Genuine ceremonial-grade peyote, imported from the southwest. This stuff is hard to find in NYC. 15 units, special price."
      },
      {
        id: "shadow_space_upgrade",
        type: "special",
        specialEffect: {
          type: "maxInventorySpace",
          value: 40
        },
        description: "I know a guy who makes custom compartments for discreet transport. For $1500, he can mod your gear to hold 40 more units."
      }
    ]
  },
  {
    id: "doctor_feel_good",
    name: "Doctor Feel Good",
    description: "A former medical professional who now deals in pharmaceutical-grade products.",
    personality: "Professional, precise, and clinical in approach. Still uses medical terminology.",
    favoredBoroughs: ["manhattan", "queens"],
    probability: 0.13,
    deals: [
      {
        id: "doctor_speed_deal",
        type: "sell",
        itemId: "speed",
        itemName: "Pharmaceutical Speed",
        quantity: 50,
        price: 100, // Discount
        description: "Pharmaceutical-grade amphetamines. Much safer and more consistent than street meth. I can provide 50 units at a discount."
      },
      {
        id: "doctor_health_pack",
        type: "special",
        specialEffect: {
          type: "health",
          value: 50
        },
        description: "I still have my medical supplies. For $800, I can patch you up completely - no questions asked."
      }
    ]
  },
  {
    id: "street_hustler",
    name: "Lil' Hustle",
    description: "A young street entrepreneur who's always working multiple angles.",
    personality: "Fast-talking, energetic, and always on the lookout for opportunities.",
    favoredBoroughs: ["bronx", "brooklyn", "queens"],
    probability: 0.2,
    deals: [
      {
        id: "hustle_ecstasy_deal",
        type: "trade",
        itemId: "ecstasy",
        itemName: "Club Ecstasy",
        quantity: 30,
        description: "I got these pills from the club scene, but I need some weed. Trade me 10 units of weed for 30 pills of E?"
      },
      {
        id: "hustle_crack_deal",
        type: "sell",
        itemId: "crack",
        itemName: "Crack",
        quantity: 20,
        price: 1500, // Discount
        description: "Just cooked this batch myself. Purest stuff in the neighborhood. I'll hook you up with 20 units at a special price."
      },
      {
        id: "hustle_gun_deal",
        type: "special",
        specialEffect: {
          type: "guns",
          value: 1
        },
        description: "I found this piece yesterday. Clean, no history. $500 and it's yours, no questions asked."
      }
    ]
  }
];
