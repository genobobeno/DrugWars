import { MarketItem, Borough, DrugItem } from "../types/game";
import { drugs } from "./gameData";

// Track active drug events
const activeEvents: Record<string, boolean> = {};

/**
 * Generate a price within a range that's unlikely to hit the exact boundaries
 * This creates a more natural price distribution by:
 * 1. Slightly contracting the range to avoid exact boundary values
 * 2. Adding small random noise to reduce price predictability
 */
function generatePriceInRange(minPrice: number, maxPrice: number): number {
  // Create a small buffer (0.5-2% of range) to avoid exact boundary values
  const range = maxPrice - minPrice;
  const buffer = Math.max(5, range * 0.01);
  
  // Generate price within a slightly contracted range
  const adjustedMin = minPrice + buffer;
  const adjustedMax = maxPrice - buffer;
  
  let price: number;
  // Handle the case where range is very small
  if (adjustedMax <= adjustedMin) {
    // Even with small ranges, add some randomness rather than just using midpoint
    const midPoint = (minPrice + maxPrice) / 2;
    const smallNoise = (Math.random() * 0.1 - 0.05) * (maxPrice - minPrice); // ±5% of range
    price = midPoint + smallNoise;
  } else {
    price = adjustedMin + Math.random() * (adjustedMax - adjustedMin);
  }
  
  // Add small noise (-3 to +3) to make prices less predictable
  // This helps prevent patterns like always seeing the same numbers
  price += (Math.random() * 6 - 3);
  
  // Ensure we're still within the original range
  price = Math.min(Math.max(price, minPrice), maxPrice);
  
  return price;
}

// Generate prices for all items based on location, drug availability, and events
export function generatePrices(
  items: MarketItem[],
  currentBorough: Borough | null,
): Record<string, number> {
  const prices: Record<string, number> = {};
  const availableItems: Record<string, boolean> = {};

  // Reset active events when generating new prices
  Object.keys(activeEvents).forEach((key) => delete activeEvents[key]);

  // Process each drug to determine availability and pricing
  for (const drug of drugs) {
    // Determine if the drug is available in the market today
    const isAvailable = Math.random() < drug.marketDailyProbability;
    availableItems[drug.id] = isAvailable;

    if (isAvailable) {
      // Check if a special event is happening for this drug
      const isEvent = Math.random() < drug.dailyEventProbability;
      // Store the event state for this drug
      activeEvents[drug.id] = isEvent;

      let price: number;
      let minPrice: number;
      let maxPrice: number;

      if (isEvent) {
        // Use event price range
        [minPrice, maxPrice] = drug.eventParameters;
      } else {
        // Use normal price range
        [minPrice, maxPrice] = drug.noEventParameters;
      }
      
      // Generate price using our improved method that avoids boundary values
      price = generatePriceInRange(minPrice, maxPrice);

      // Apply location-based factor if a borough is provided
      if (currentBorough) {
        const locationFactor =
          currentBorough.priceFactors[
            drug.category as keyof typeof currentBorough.priceFactors
          ] || 1;
        price *= locationFactor;
        
        // If factor pushes price outside range, adjust but avoid exact boundaries
        if (price < minPrice || price > maxPrice) {
          price = generatePriceInRange(
            Math.min(price, minPrice), 
            Math.max(price, maxPrice)
          );
        }
      }
      
      // Round to nearest dollar
      prices[drug.id] = Math.round(price);
    } else {
      // Drug is not available in this market
      prices[drug.id] = -1; // Use -1 to indicate unavailability
      activeEvents[drug.id] = false; // No event for unavailable drugs
    }
  }

  return prices;
}

// Get event description if there's an active event for this drug
export function getDrugEventDescription(drugId: string): string | null {
  const drug = drugs.find((d) => d.id === drugId);
  if (!drug) return null;

  // Get the stored event state instead of generating a new random value
  const isEvent = activeEvents[drugId] || false;

  return isEvent ? drug.eventDescription : null;
}

// Check if a drug is available in the current market
export function isDrugAvailable(
  drugId: string,
  prices: Record<string, number>,
): boolean {
  return prices[drugId] > 0; // If price is -1, drug is unavailable
}

// Generate sale price for a specific item (for events or special deals)
export function generateSalePrice(
  item: MarketItem,
  currentPrice: number,
  discount: number,
): number {
  // Apply discount (0.1 = 10% off)
  const salePrice = currentPrice * (1 - discount);

  // Round to nearest dollar
  return Math.round(salePrice);
}

// Generate surge price for a specific item (for events or special situations)
export function generateSurgePrice(
  item: MarketItem,
  currentPrice: number,
  surge: number,
): number {
  // Apply surge (0.1 = 10% increase)
  const surgePrice = currentPrice * (1 + surge);

  // Round to nearest dollar
  return Math.round(surgePrice);
}
