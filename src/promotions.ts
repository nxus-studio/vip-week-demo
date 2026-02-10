import { Tier } from './customers';
import { roundCents } from './money';
import { PricedLine } from './pricing';

export interface Promotion {
  code: string;
  percentOff: number;
  /** first and last day of the promotion, inclusive, as YYYY-MM-DD */
  from: string;
  to: string;
  tiers: Tier[];
}

export const PROMOTIONS: Promotion[] = [
  { code: 'VIP-WEEK', percentOff: 10, from: '2026-03-01', to: '2026-03-07', tiers: ['gold'] },
];

export function isActive(promo: Promotion, at: number): boolean {
  const start = new Date(`${promo.from}T00:00:00`).getTime();
  const end = new Date(`${promo.to}T23:59:59`).getTime();
  return at >= start && at <= end;
}

export function activePromotion(tier: Tier | undefined, at: number): Promotion | undefined {
  if (!tier) return undefined;
  return PROMOTIONS.find((p) => p.tiers.includes(tier) && isActive(p, at));
}

/** Lowers the unit price of every line by the promotion's percentage. */
export function applyPromotion(lines: PricedLine[], promo: Promotion): void {
  for (const line of lines) {
    line.unitCents = roundCents((line.unitCents * (100 - promo.percentOff)) / 100);
  }
}
