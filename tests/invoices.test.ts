import { invoiceDate, renderInvoice } from '../src/invoices';
import { createOrder } from '../src/orders';
import { world } from './helpers';

describe('invoices', () => {
  it('dates an invoice in the store timezone, not the process timezone', () => {
    expect(invoiceDate(Date.UTC(2026, 2, 8, 2, 0, 0))).toBe('2026-03-07');
  });
  it('renders the totals of the order', () => {
    const { catalog, inventory, ana } = world();
    const order = createOrder(ana, [{ sku: 'MUG-1', quantity: 2 }], catalog, inventory);
    expect(renderInvoice(order, catalog, ana)).toContain('Total     $31.91');
  });
});
