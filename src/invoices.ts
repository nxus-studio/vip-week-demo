import { Catalog } from './catalog';
import { STORE_TZ } from './config';
import { Customer } from './customers';
import { formatMoney } from './money';
import { Order, orderTotals } from './orders';

/** YYYY-MM-DD of the instant in the store's timezone. */
export function invoiceDate(at: number): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: STORE_TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(at);
}

export function renderInvoice(order: Order, catalog: Catalog, customer: Customer): string {
  const totals = orderTotals(order, catalog);
  const lines = order.lines.map((l) => `  ${l.quantity} x ${catalog.get(l.sku).name}`);
  return [
    `Invoice ${order.id} (${invoiceDate(order.createdAt)})`,
    `Customer: ${customer.name}`,
    ...lines,
    `Subtotal  ${formatMoney(totals.subtotalCents)}`,
    `Tax       ${formatMoney(totals.taxCents)}`,
    `Shipping  ${formatMoney(totals.shippingCents)}`,
    `Total     ${formatMoney(totals.totalCents)}`,
  ].join('\n');
}
