export function creditsToDollars(credits: number) {
  let dollars = credits / 10000;
  return dollars.toFixed(2);
}
