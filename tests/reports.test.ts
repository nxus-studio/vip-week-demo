import { createOrder, cancelOrder } from '../src/orders';
import { salesReport } from '../src/reports';
import { world } from './helpers';

describe('reports', () => {
  it('sums revenue and categories over placed orders only', () => {
    const { catalog, inventory, ana, gus } = world();
    const a = createOrder(ana, [{ sku: 'MUG-1', quantity: 2 }], catalog, inventory);
    const b = createOrder(gus, [{ sku: 'BOOK-1', quantity: 1 }, { sku: 'PEN-1', quantity: 4 }], catalog, inventory);
    const c = cancelOrder(createOrder(gus, [{ sku: 'LAMP-1', quantity: 1 }], catalog, inventory), inventory);
    const report = salesReport([a, b, c], catalog);
    expect(report.orderCount).toBe(2);
    expect(report.byCategory).toEqual({ home: 2400, books: 2500, office: 1200 });
  });
  it('ranks the top products by quantity', () => {
    const { catalog, inventory, ana } = world();
    const order = createOrder(ana, [{ sku: 'PEN-1', quantity: 9 }, { sku: 'MUG-1', quantity: 3 }, { sku: 'BOOK-1', quantity: 1 }], catalog, inventory);
    expect(salesReport([order], catalog).topProducts.map((p) => p.sku)).toEqual(['PEN-1', 'MUG-1', 'BOOK-1']);
  });
});
