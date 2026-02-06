import { orderTotals } from '../src/orders';
import { world } from './helpers';

const MID_VIP_WEEK = Date.UTC(2026, 2, 4, 18, 0, 0);
const AFTER_VIP_WEEK = Date.UTC(2026, 2, 20, 18, 0, 0);

function order(customerId: string, tier: 'standard' | 'gold', createdAt: number) {
  return { id: 'o1', customerId, tier, status: 'placed' as const, createdAt, lines: [{ sku: 'MUG-1', quantity: 2 }] };
}

describe('VIP week', () => {
  it('gives gold customers 10% off the unit price during the week', () => {
    const { catalog, gus } = world();
    expect(orderTotals(order(gus.id, 'gold', MID_VIP_WEEK), catalog)).toEqual({ subtotalCents: 2160, taxCents: 173, shippingCents: 599, totalCents: 2932 });
  });
  it('does not touch standard customers or orders outside the week', () => {
    const { catalog, ana, gus } = world();
    expect(orderTotals(order(ana.id, 'standard', MID_VIP_WEEK), catalog).subtotalCents).toBe(2400);
    expect(orderTotals(order(gus.id, 'gold', AFTER_VIP_WEEK), catalog).subtotalCents).toBe(2400);
  });
});
