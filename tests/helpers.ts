import { Catalog } from '../src/catalog';
import { CustomerBook } from '../src/customers';
import { Inventory } from '../src/inventory';
import { resetIds } from '../src/ids';

export function world() {
  resetIds();
  const catalog = new Catalog();
  catalog.add({ sku: 'BOOK-1', name: 'TypeScript Handbook', priceCents: 2500, taxable: false, category: 'books' });
  catalog.add({ sku: 'MUG-1', name: 'Blue Mug', priceCents: 1200, taxable: true, category: 'home' });
  catalog.add({ sku: 'LAMP-1', name: 'Desk Lamp', priceCents: 4500, taxable: true, category: 'home' });
  catalog.add({ sku: 'PEN-1', name: 'Gel Pen', priceCents: 300, taxable: true, category: 'office' });
  const inventory = new Inventory();
  inventory.setStock('BOOK-1', 10);
  inventory.setStock('MUG-1', 20);
  inventory.setStock('LAMP-1', 5);
  inventory.setStock('PEN-1', 100);
  const customers = new CustomerBook();
  const ana = customers.register('Ana Ruiz', 'ana@example.com');
  const gus = customers.register('Gus Lopez', 'gus@example.com', 'gold');
  return { catalog, inventory, customers, ana, gus };
}
