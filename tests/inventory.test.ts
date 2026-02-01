import { Inventory, InsufficientStockError } from '../src/inventory';

describe('inventory', () => {
  it('reserves and reports availability', () => {
    const inv = new Inventory();
    inv.setStock('A', 5);
    inv.reserve([{ sku: 'A', quantity: 2 }]);
    expect(inv.available('A')).toBe(3);
  });
  it('throws when there is not enough stock', () => {
    const inv = new Inventory();
    inv.setStock('A', 1);
    expect(() => inv.reserve([{ sku: 'A', quantity: 2 }])).toThrow(InsufficientStockError);
  });
  it('releases stock back', () => {
    const inv = new Inventory();
    inv.setStock('A', 5);
    inv.reserve([{ sku: 'A', quantity: 4 }]);
    inv.release([{ sku: 'A', quantity: 4 }]);
    expect(inv.available('A')).toBe(5);
  });
  it('rejects non-positive quantities', () => {
    const inv = new Inventory();
    inv.setStock('A', 5);
    expect(() => inv.reserve([{ sku: 'A', quantity: 0 }])).toThrow('quantity');
  });
  it('snapshots stock sorted by sku', () => {
    const inv = new Inventory();
    inv.setStock('B', 1);
    inv.setStock('A', 2);
    expect(Object.keys(inv.snapshot())).toEqual(['A', 'B']);
  });
});
