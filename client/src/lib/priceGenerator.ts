import { MarketItem, Borough, DrugItem } from "../types/game";
import { drugs } from "./gameData";

// Track active drug events
const activeEvents: Record<string, boolean> = {};

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
        price = minPrice + Math.random() * (maxPrice - minPrice);
      } else {
        // Use normal price range
        [minPrice, maxPrice] = drug.noEventParameters;
        price = minPrice + Math.random() * (maxPrice - minPrice);
      }

      // Apply location-based factor if a borough is provided
      if (currentBorough) {
        const locationFactor =
          currentBorough.priceFactors[
            drug.category as keyof typeof currentBorough.priceFactors
          ] || 1;
        price *= locationFactor;
        
        // Ensure price stays within the defined range for the drug
        // even after borough multipliers are applied
        if (!isEvent) {
          // For normal prices
          price = Math.min(Math.max(price, minPrice), maxPrice);
        } else {
          // For event prices
          price = Math.min(Math.max(price, minPrice), maxPrice);
        }
      }

      // Enforce strict limits based on the drug's event status
      if (isEvent) {
        // If it's an event, use event parameters as strict min/max
        price = Math.min(Math.max(price, drug.eventParameters[0]), drug.eventParameters[1]);
      } else {
        // If it's not an event, use normal parameters as strict min/max
        price = Math.min(Math.max(price, drug.noEventParameters[0]), drug.noEventParameters[1]);
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
