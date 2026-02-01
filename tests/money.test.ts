import { toCents, fromCents, roundCents, formatMoney } from '../src/money';

describe('money', () => {
  it('converts dollars to cents', () => {
    expect(toCents(12.34)).toBe(1234);
    expect(toCents(0.1 + 0.2)).toBe(30);
  });
  it('converts cents back to dollars', () => {
    expect(fromCents(1234)).toBe(12.34);
  });
  it('rounds half up', () => {
    expect(roundCents(10.5)).toBe(11);
    expect(roundCents(10.49)).toBe(10);
    expect(roundCents(0.5)).toBe(1);
  });
  it('formats with thousands separators', () => {
    expect(formatMoney(123456789)).toBe('$1,234,567.89');
    expect(formatMoney(5)).toBe('$0.05');
    expect(formatMoney(-250)).toBe('-$2.50');
  });
});
