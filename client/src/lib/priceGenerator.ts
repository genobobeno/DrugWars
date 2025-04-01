import { MarketItem, Borough } from "../types/game";

// Generate prices for all items based on location and random factors
export function generatePrices(items: MarketItem[], currentBorough: Borough | null): Record<string, number> {
  const prices: Record<string, number> = {};
  
  // Get a random factor for the entire market (simulates market trends)
  const marketFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
  
  for (const item of items) {
    let price = item.basePrice;
    
    // Apply random volatility based on item's properties
    const volatilityFactor = 1 + (Math.random() * 2 - 1) * item.volatility;
    price *= volatilityFactor;
    
    // Apply market trend factor
    price *= marketFactor;
    
    // Apply location-based factor if a borough is provided
    if (currentBorough) {
      const locationFactor = currentBorough.priceFactors[item.category as keyof typeof currentBorough.priceFactors] || 1;
      price *= locationFactor;
    }
    
    // Add small random variation to make prices look more natural
    price = price * (0.95 + Math.random() * 0.1);
    
    // Round to nearest dollar
    prices[item.id] = Math.round(price);
  }
  
  return prices;
}

// Generate sale price for a specific item (for events or special deals)
export function generateSalePrice(item: MarketItem, currentPrice: number, discount: number): number {
  // Apply discount (0.1 = 10% off)
  const salePrice = currentPrice * (1 - discount);
  
  // Round to nearest dollar
  return Math.round(salePrice);
}

// Generate surge price for a specific item (for events or special situations)
export function generateSurgePrice(item: MarketItem, currentPrice: number, surge: number): number {
  // Apply surge (0.1 = 10% increase)
  const surgePrice = currentPrice * (1 + surge);
  
  // Round to nearest dollar
  return Math.round(surgePrice);
}
