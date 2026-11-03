/** Password printed on the Swag Labs login screen. Shared by every demo user. */
export const password = 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password },
  lockedOut: { username: 'locked_out_user', password },
} as const;

export type SortOrder = 'az' | 'za' | 'lohi' | 'hilo';

export type Product = {
  id: number;
  name: string;
  price: number;
};

/** Source order in the Swag Labs catalog. The inventory opens sorted by name. */
export const catalog: readonly Product[] = [
  { id: 0, name: 'Sauce Labs Bike Light', price: 9.99 },
  { id: 1, name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
  { id: 2, name: 'Sauce Labs Onesie', price: 7.99 },
  { id: 3, name: 'Test.allTheThings() T-Shirt (Red)', price: 15.99 },
  { id: 4, name: 'Sauce Labs Backpack', price: 29.99 },
  { id: 5, name: 'Sauce Labs Fleece Jacket', price: 49.99 },
];

export const products = {
  bikeLight: catalog[0],
  boltShirt: catalog[1],
  onesie: catalog[2],
  redShirt: catalog[3],
  backpack: catalog[4],
  fleeceJacket: catalog[5],
} as const;

export type OrderSummary = {
  subtotal: string;
  tax: string;
  total: string;
};

/**
 * Swag Labs sums the item prices, formats tax with `(subtotal * 0.08).toFixed(2)`,
 * then adds that rounded tax back onto the raw subtotal.
 */
export function orderSummary(prices: readonly number[]): OrderSummary {
  const subtotal = prices.reduce((sum, price) => sum + price, 0);
  const tax = (subtotal * 0.08).toFixed(2);
  const total = (subtotal + Number(tax)).toFixed(2);

  return {
    subtotal: `Item total: $${subtotal}`,
    tax: `Tax: $${tax}`,
    total: `Total: $${total}`,
  };
}
