import { assertPositiveInt } from './validation';
import { log } from './logger';

export interface StockLine {
  sku: string;
  quantity: number;
}

export class InsufficientStockError extends Error {
  constructor(public sku: string, public requested: number, public available: number) {
    super(`Insufficient stock for ${sku}: requested ${requested}, available ${available}`);
    this.name = 'InsufficientStockError';
  }
}

export class Inventory {
  private stock = new Map<string, number>();

  setStock(sku: string, quantity: number): void {
    if (!Number.isInteger(quantity) || quantity < 0) throw new Error('stock must be a non-negative integer');
    this.stock.set(sku, quantity);
  }

  available(sku: string): number {
    return this.stock.get(sku) ?? 0;
  }

  /** Reserve stock for every line of an order. */
  reserve(lines: StockLine[]): void {
    for (const line of lines) {
      assertPositiveInt(line.quantity, 'quantity');
      const available = this.available(line.sku);
      if (line.quantity > available) {
        log('error', `cannot reserve ${line.quantity} of ${line.sku}`);
        throw new InsufficientStockError(line.sku, line.quantity, available);
      }
      this.stock.set(line.sku, available - line.quantity);
    }
  }

  /** Give reserved stock back, e.g. when an order is cancelled. */
  release(lines: StockLine[]): void {
    for (const line of lines) {
      assertPositiveInt(line.quantity, 'quantity');
      this.stock.set(line.sku, this.available(line.sku) + line.quantity);
    }
  }

  snapshot(): Record<string, number> {
    return Object.fromEntries([...this.stock.entries()].sort(([a], [b]) => a.localeCompare(b)));
  }
}
