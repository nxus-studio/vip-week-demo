import { priceLines, subtotalCents, taxCents, taxableSubtotalCents } from '../src/pricing';
import { shippingCents } from '../src/shipping';
import { world } from './helpers';

describe('pricing', () => {
  it('computes subtotal and the taxable part', () => {
    const { catalog } = world();
    const priced = priceLines([{ sku: 'BOOK-1', quantity: 2 }, { sku: 'MUG-1', quantity: 3 }], catalog);
    expect(subtotalCents(priced)).toBe(2 * 2500 + 3 * 1200);
    expect(taxableSubtotalCents(priced)).toBe(3 * 1200);
  });
  it('taxes only taxable lines at 8%', () => {
    const { catalog } = world();
    const priced = priceLines([{ sku: 'BOOK-1', quantity: 1 }, { sku: 'LAMP-1', quantity: 1 }], catalog);
    expect(taxCents(priced)).toBe(360);
  });
  it('charges flat shipping under $100 and nothing at or above', () => {
    expect(shippingCents(9999)).toBe(599);
    expect(shippingCents(10000)).toBe(0);
    expect(shippingCents(0)).toBe(0);
  });
});
