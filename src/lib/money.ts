const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** Format integer cents as US dollars, e.g. 4196 -> "$41.96". */
export function formatMoney(cents: number): string {
  return usd.format(cents / 100);
}
