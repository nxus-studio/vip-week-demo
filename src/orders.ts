import { Catalog } from './catalog';
import { Customer } from './customers';
import { Inventory, StockLine } from './inventory';
import { nextId } from './ids';
import { log } from './logger';
import { priceLines, subtotalCents, taxCents, PricedLine } from './pricing';
import { shippingCents } from './shipping';
import { assertPositiveInt, ValidationError } from './validation';

export type OrderStatus = 'placed' | 'cancelled';

export interface OrderLine extends StockLine {}

export interface Order {
  id: string;
  customerId: string;
  lines: OrderLine[];
  status: OrderStatus;
  createdAt: number;
}

export interface Totals {
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
}

export function createOrder(customer: Customer, lines: OrderLine[], catalog: Catalog, inventory: Inventory): Order {
  if (lines.length === 0) throw new ValidationError('an order needs at least one line');
  for (const line of lines) {
    assertPositiveInt(line.quantity, 'quantity');
    catalog.get(line.sku);
  }
  inventory.reserve(lines);
  const order: Order = {
    id: nextId('ord'),
    customerId: customer.id,
    lines: lines.map((l) => ({ ...l })),
    status: 'placed',
    createdAt: Date.now(),
  };
  log('info', `order ${order.id} placed for ${customer.name}`);
  return order;
}

export function cancelOrder(order: Order, inventory: Inventory): Order {
  if (order.status === 'cancelled') return order;
  inventory.release(order.lines);
  log('info', `order ${order.id} cancelled`);
  return { ...order, status: 'cancelled' };
}

export function orderTotals(order: Order, catalog: Catalog): Totals {
  const priced: PricedLine[] = priceLines(order.lines, catalog);
  const subtotal = subtotalCents(priced);
  const tax = taxCents(priced);
  const shipping = shippingCents(subtotal);
  return { subtotalCents: subtotal, taxCents: tax, shippingCents: shipping, totalCents: subtotal + tax + shipping };
}
