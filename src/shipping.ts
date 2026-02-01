export const FREE_SHIPPING_THRESHOLD_CENTS = 10000;
export const FLAT_SHIPPING_CENTS = 599;

/** Orders of $100.00 or more ship free. */
export function shippingCents(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS;
}
