import { assertNonEmpty, assertPositiveInt } from './validation';
import { log } from './logger';

export interface Product {
  sku: string;
  name: string;
  priceCents: number;
  taxable: boolean;
  category: string;
}

export class Catalog {
  private products = new Map<string, Product>();

  add(product: Product): void {
    assertNonEmpty(product.sku, 'sku');
    assertNonEmpty(product.name, 'name');
    assertPositiveInt(product.priceCents, 'priceCents');
    if (this.products.has(product.sku)) {
      log('warn', `product ${product.sku} already exists, replacing it`);
    }
    this.products.set(product.sku, { ...product });
  }

  get(sku: string): Product {
    const product = this.products.get(sku);
    if (!product) throw new Error(`Unknown product ${sku}`);
    return product;
  }

  has(sku: string): boolean {
    return this.products.has(sku);
  }

  list(): Product[] {
    return [...this.products.values()].sort((a, b) => a.sku.localeCompare(b.sku));
  }

  byCategory(category: string): Product[] {
    return this.list().filter((p) => p.category === category);
  }

  search(text: string): Product[] {
    const needle = text.trim().toLowerCase();
    if (!needle) return [];
    return this.list().filter((p) => p.name.toLowerCase().includes(needle) || p.sku.toLowerCase().includes(needle));
  }
}

// search() matches name or sku, case-insensitive.

// list() is sorted by sku so reports are stable.
