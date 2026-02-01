import { Catalog } from '../src/catalog';
import { world } from './helpers';

describe('catalog', () => {
  it('lists products sorted by sku', () => {
    const { catalog } = world();
    expect(catalog.list().map((p) => p.sku)).toEqual(['BOOK-1', 'LAMP-1', 'MUG-1', 'PEN-1']);
  });
  it('filters by category', () => {
    const { catalog } = world();
    expect(catalog.byCategory('home').map((p) => p.sku)).toEqual(['LAMP-1', 'MUG-1']);
  });
  it('searches by name or sku, case-insensitively', () => {
    const { catalog } = world();
    expect(catalog.search('mug').map((p) => p.sku)).toEqual(['MUG-1']);
    expect(catalog.search('pen-1').map((p) => p.sku)).toEqual(['PEN-1']);
    expect(catalog.search('  ')).toEqual([]);
  });
  it('rejects unknown products and bad prices', () => {
    const { catalog } = world();
    expect(() => catalog.get('NOPE')).toThrow('Unknown product NOPE');
    expect(() => catalog.add({ sku: 'X', name: 'X', priceCents: 0, taxable: true, category: 'x' })).toThrow('priceCents');
  });
  it('replaces a product added twice and warns about it', () => {
    const catalog = new Catalog();
    catalog.add({ sku: 'A', name: 'A', priceCents: 100, taxable: true, category: 'x' });
    catalog.add({ sku: 'A', name: 'A2', priceCents: 200, taxable: true, category: 'x' });
    expect(catalog.get('A').priceCents).toBe(200);
  });
});
