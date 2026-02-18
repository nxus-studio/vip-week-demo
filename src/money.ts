/** Money is always integer cents. */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

/** Round half up to a whole cent (inputs are already in cents, possibly fractional). */
export function roundCents(value: number): number {
  return Math.floor(value + 0.5);
}

export function formatMoney(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const rest = String(abs % 100).padStart(2, '0');
  return `${sign}$${dollars.toLocaleString('en-US')}.${rest}`;
}

// all money values in this service are integer cents.
