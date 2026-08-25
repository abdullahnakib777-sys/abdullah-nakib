/**
 * Dedicated Server-Side Profit & Financial Calculation Engine
 * 
 * All monetary calculations for BDT (৳) are centralized here.
 * Financial values are calculated on the server to prevent client-side tampering.
 */

export interface ProfitCalculationInput {
  baseCost: number;             // Cost to the platform from supplier/warehouse
  resellerPrice: number;        // Wholesale cost to the reseller
  actualSellingPrice: number;   // Price reseller charged to customer
  quantity: number;
  division: string;             // Used for delivery fee calculation
  platformFeePercent?: number;  // Default from platform settings (e.g., 2%)
}

export interface ProfitCalculationResult {
  quantity: number;
  totalBaseCost: number;
  totalResellerCost: number;
  totalCustomerPrice: number;
  deliveryFee: number;
  platformFee: number;
  grossResellerProfit: number;
  netResellerProfit: number;
  platformMargin: number;
  isProfitable: boolean;
}

export class ProfitEngine {
  /**
   * Calculates delivery fee based on division in Bangladesh
   * Dhaka Metropolitan: ৳60
   * Outside Dhaka: ৳120
   */
  static getDeliveryFee(division: string): number {
    const isDhaka = division?.trim().toLowerCase() === 'dhaka';
    return isDhaka ? 60 : 120;
  }

  /**
   * Calculates detailed profit breakdown for an order item or whole order
   */
  static calculateItemProfit(
    baseCost: number,
    resellerPrice: number,
    sellingPrice: number,
    quantity: number,
    platformFeePercent = 0
  ) {
    const qty = Math.max(1, Math.floor(quantity));
    const totalBaseCost = Math.round(baseCost * qty);
    const totalResellerCost = Math.round(resellerPrice * qty);
    const totalCustomerPrice = Math.round(sellingPrice * qty);

    // Reseller profit is the difference between what the customer is charged and the wholesale reseller price
    const grossResellerProfit = Math.max(0, totalCustomerPrice - totalResellerCost);
    const platformFee = Math.round((grossResellerProfit * platformFeePercent) / 100);
    const netResellerProfit = grossResellerProfit - platformFee;

    // Platform margin is the difference between wholesale reseller price and base warehouse cost + any platform fees
    const platformMargin = Math.max(0, totalResellerCost - totalBaseCost) + platformFee;

    return {
      quantity: qty,
      totalBaseCost,
      totalResellerCost,
      totalCustomerPrice,
      grossResellerProfit,
      platformFee,
      netResellerProfit,
      platformMargin,
      isProfitable: sellingPrice >= resellerPrice,
    };
  }

  /**
   * Comprehensive order calculation including delivery and ledger deductions
   */
  static calculateOrder(input: ProfitCalculationInput): ProfitCalculationResult {
    const itemCalc = this.calculateItemProfit(
      input.baseCost,
      input.resellerPrice,
      input.actualSellingPrice,
      input.quantity,
      input.platformFeePercent || 0
    );

    const deliveryFee = this.getDeliveryFee(input.division);

    return {
      ...itemCalc,
      deliveryFee,
    };
  }
}
