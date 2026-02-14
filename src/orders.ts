import { Catalog } from './catalog';
import { Customer, Tier } from './customers';
import { Inventory, StockLine } from './inventory';
import { nextId } from './ids';
import { log } from './logger';
import { priceLines, subtotalCents, taxCents, PricedLine } from './pricing';
import { activePromotion, applyPromotion } from './promotions';
import { shippingCents } from './shipping';
import { assertPositiveInt, ValidationError } from './validation';

export type OrderStatus = 'placed' | 'cancelled';

export interface OrderLine extends StockLine {}

export interface Order {
  id: string;
  customerId: string;
  tier?: Tier;
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
    tier: customer.tier,
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

const pricedLinesByOrder = new WeakMap<Order, PricedLine[]>();

function pricedLinesFor(order: Order, catalog: Catalog): PricedLine[] {
  let priced = pricedLinesByOrder.get(order);
  if (!priced) {
    priced = priceLines(order.lines, catalog);
    pricedLinesByOrder.set(order, priced);
  }
  return priced;
}

export function orderTotals(order: Order, catalog: Catalog): Totals {
  const priced: PricedLine[] = pricedLinesFor(order, catalog);
  const promo = activePromotion(order.tier, order.createdAt);
  if (promo) applyPromotion(priced, promo);
  const subtotal = subtotalCents(priced);
  const tax = taxCents(priced);
  const shipping = shippingCents(subtotal);
  return { subtotalCents: subtotal, taxCents: tax, shippingCents: shipping, totalCents: subtotal + tax + shipping };
}
