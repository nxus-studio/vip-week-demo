import { roundCents } from './money';
import { Catalog } from './catalog';

export const TAX_RATE = 0.08;

export interface PricedLine {
  sku: string;
  quantity: number;
  unitCents: number;
  taxable: boolean;
}

export function priceLines(lines: { sku: string; quantity: number }[], catalog: Catalog): PricedLine[] {
  return lines.map((line) => {
    const product = catalog.get(line.sku);
    return { sku: line.sku, quantity: line.quantity, unitCents: product.priceCents, taxable: product.taxable };
  });
}

export function lineTotalCents(line: PricedLine): number {
  return line.unitCents * line.quantity;
}

export function subtotalCents(lines: PricedLine[]): number {
  return lines.reduce((sum, line) => sum + lineTotalCents(line), 0);
}

export function taxableSubtotalCents(lines: PricedLine[]): number {
  return lines.filter((l) => l.taxable).reduce((sum, line) => sum + lineTotalCents(line), 0);
}

export function taxCents(lines: PricedLine[]): number {
  return roundCents(taxableSubtotalCents(lines) * TAX_RATE);
}
