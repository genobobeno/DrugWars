import { Borough, MarketItem } from "../types/game";

// Define the boroughs
export const boroughs: Borough[] = [
  {
    id: "bronx",
    name: "The Bronx",
    description: "Rough and varied, with both high crime areas and family neighborhoods.",
    priceFactors: {
      electronics: 0.9,
      luxury: 1.2,
      medication: 1.0,
      contraband: 0.8,
      food: 0.9
    }
  },
  {
    id: "brooklyn",
    name: "Brooklyn",
    description: "Trendy and diverse with artsy neighborhoods and industrial zones.",
    priceFactors: {
      electronics: 1.0,
      luxury: 1.1,
      medication: 0.9,
      contraband: 0.9,
      food: 0.8
    }
  },
  {
    id: "manhattan",
    name: "Manhattan",
    description: "The heart of NYC, expensive and heavily policed.",
    priceFactors: {
      electronics: 1.2,
      luxury: 1.5,
      medication: 1.2,
      contraband: 1.3,
      food: 1.1
    }
  },
  {
    id: "queens",
    name: "Queens",
    description: "Diverse and residential with many cultural communities.",
    priceFactors: {
      electronics: 0.95,
      luxury: 0.9,
      medication: 0.95,
      contraband: 1.0,
      food: 0.85
    }
  },
  {
    id: "staten_island",
    name: "Staten Island",
    description: "Suburban and isolated, with less police presence.",
    priceFactors: {
      electronics: 1.1,
      luxury: 0.8,
      medication: 1.1,
      contraband: 0.7,
      food: 1.0
    }
  }
];

// Define the market items
export const items: MarketItem[] = [
  // Electronics category
  {
    id: "smartphone",
    name: "Smartphone",
    category: "electronics",
    description: "Latest model smartphone, high demand everywhere.",
    basePrice: 800,
    volatility: 0.15
  },
  {
    id: "laptop",
    name: "Laptop Computer",
    category: "electronics",
    description: "Business-grade laptop, popular in Manhattan.",
    basePrice: 1200,
    volatility: 0.25
  },
  {
    id: "headphones",
    name: "Premium Headphones",
    category: "electronics",
    description: "Noise-cancelling headphones, popular with commuters.",
    basePrice: 300,
    volatility: 0.2
  },
  
  // Luxury category
  {
    id: "watch",
    name: "Luxury Watch",
    category: "luxury",
    description: "High-end timepiece, especially valuable in wealthy areas.",
    basePrice: 5000,
    volatility: 0.3
  },
  {
    id: "jewelry",
    name: "Designer Jewelry",
    category: "luxury",
    description: "Fashionable accessories, popular in Manhattan.",
    basePrice: 2000,
    volatility: 0.35
  },
  {
    id: "sneakers",
    name: "Limited Edition Sneakers",
    category: "luxury",
    description: "Collectible footwear, high demand in Brooklyn.",
    basePrice: 600,
    volatility: 0.4
  },
  
  // Medication category
  {
    id: "painkillers",
    name: "Pain Relievers",
    category: "medication",
    description: "Over-the-counter medication, steady demand everywhere.",
    basePrice: 50,
    volatility: 0.1
  },
  {
    id: "antibiotics",
    name: "Antibiotics",
    category: "medication",
    description: "Generic antibiotics, useful during flu season.",
    basePrice: 120,
    volatility: 0.2
  },
  {
    id: "vitamins",
    name: "Health Supplements",
    category: "medication",
    description: "Various vitamins and supplements, popular in affluent areas.",
    basePrice: 80,
    volatility: 0.15
  },
  
  // Contraband category
  {
    id: "cigarettes",
    name: "Cigarette Cartons",
    category: "contraband",
    description: "Untaxed cigarettes, risky but profitable.",
    basePrice: 100,
    volatility: 0.5
  },
  {
    id: "counterfeit",
    name: "Counterfeit Goods",
    category: "contraband",
    description: "Fake designer items, high risk of police attention.",
    basePrice: 300,
    volatility: 0.6
  },
  {
    id: "fake_id",
    name: "Fake IDs",
    category: "contraband",
    description: "Forged identification, very high risk but valuable.",
    basePrice: 200,
    volatility: 0.7
  },
  
  // Food category
  {
    id: "coffee",
    name: "Artisanal Coffee",
    category: "food",
    description: "Premium coffee beans, popular in Brooklyn and Manhattan.",
    basePrice: 30,
    volatility: 0.1
  },
  {
    id: "spices",
    name: "Exotic Spices",
    category: "food",
    description: "Rare cooking ingredients, popular in Queens' diverse communities.",
    basePrice: 40,
    volatility: 0.2
  },
  {
    id: "snacks",
    name: "imported Snacks",
    category: "food",
    description: "International snack foods, novelty items in many neighborhoods.",
    basePrice: 20,
    volatility: 0.15
  }
];
