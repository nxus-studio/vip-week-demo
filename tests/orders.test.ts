import { createOrder, cancelOrder, orderTotals } from '../src/orders';
import { world } from './helpers';

describe('orders', () => {
  it('creates an order and reserves stock', () => {
    const { catalog, inventory, ana } = world();
    const order = createOrder(ana, [{ sku: 'MUG-1', quantity: 2 }], catalog, inventory);
    expect(order.status).toBe('placed');
    expect(order.id).toBe('ord-0001');
    expect(inventory.available('MUG-1')).toBe(18);
  });
  it('rejects an empty order and unknown skus', () => {
    const { catalog, inventory, ana } = world();
    expect(() => createOrder(ana, [], catalog, inventory)).toThrow('at least one line');
    expect(() => createOrder(ana, [{ sku: 'NOPE', quantity: 1 }], catalog, inventory)).toThrow('Unknown product');
  });
  it('cancelling gives the stock back, once', () => {
    const { catalog, inventory, ana } = world();
    const order = createOrder(ana, [{ sku: 'LAMP-1', quantity: 3 }], catalog, inventory);
    const cancelled = cancelOrder(order, inventory);
    expect(cancelled.status).toBe('cancelled');
    expect(inventory.available('LAMP-1')).toBe(5);
    cancelOrder(cancelled, inventory);
    expect(inventory.available('LAMP-1')).toBe(5);
  });
  it('computes totals with tax and shipping', () => {
    const { catalog, inventory, ana } = world();
    const order = createOrder(ana, [{ sku: 'MUG-1', quantity: 2 }], catalog, inventory);
    expect(orderTotals(order, catalog)).toEqual({ subtotalCents: 2400, taxCents: 192, shippingCents: 599, totalCents: 3191 });
  });
  it('ships free from $100', () => {
    const { catalog, inventory, ana } = world();
    const order = createOrder(ana, [{ sku: 'LAMP-1', quantity: 3 }], catalog, inventory);
    expect(orderTotals(order, catalog).shippingCents).toBe(0);
  });
});
