import { Catalog } from './catalog';
import { Order, orderTotals } from './orders';

export interface SalesReport {
  orderCount: number;
  revenueCents: number;
  byCategory: Record<string, number>;
  topProducts: { sku: string; quantity: number }[];
}

export function salesReport(orders: Order[], catalog: Catalog): SalesReport {
  const placed = orders.filter((o) => o.status === 'placed');
  const byCategory: Record<string, number> = {};
  const quantities = new Map<string, number>();
  let revenueCents = 0;

  for (const order of placed) {
    revenueCents += orderTotals(order, catalog).totalCents;
    for (const line of order.lines) {
      const product = catalog.get(line.sku);
      byCategory[product.category] = (byCategory[product.category] ?? 0) + product.priceCents * line.quantity;
      quantities.set(line.sku, (quantities.get(line.sku) ?? 0) + line.quantity);
    }
  }

  const topProducts = [...quantities.entries()]
    .map(([sku, quantity]) => ({ sku, quantity }))
    .sort((a, b) => b.quantity - a.quantity || a.sku.localeCompare(b.sku))
    .slice(0, 3);

  return { orderCount: placed.length, revenueCents, byCategory, topProducts };
}
