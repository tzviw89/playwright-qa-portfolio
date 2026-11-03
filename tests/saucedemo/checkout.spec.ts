import { orderSummary, products } from '../../src/saucedemo/catalog';
import type { Customer } from '../../src/saucedemo/checkout.page';
import { expect, test } from '../../src/saucedemo/test';

const customer: Customer = {
  firstName: 'Jamie',
  lastName: 'Patel',
  postalCode: '10001',
};

test.describe('checkout', () => {
  test('charges 8% tax on the items left in the cart', { tag: '@smoke' }, async ({ shop, page }) => {
    await test.step('add two products, then take one out', async () => {
      await shop.inventory.add(products.backpack.name);
      await shop.inventory.add(products.bikeLight.name);
      await shop.inventory.openCart();

      await expect(page).toHaveURL(/\/cart\.html$/);
      await expect(shop.cart.itemNames).toHaveText([products.backpack.name, products.bikeLight.name]);

      await shop.cart.remove(products.bikeLight.name);
      await expect(shop.cart.itemNames).toHaveText([products.backpack.name]);
    });

    await test.step('confirm the taxed total and finish', async () => {
      await shop.cart.checkout();
      await shop.checkout.fillCustomer(customer);
      await shop.checkout.continue();

      const summary = orderSummary([products.backpack.price]);
      await expect(shop.checkout.subtotal).toHaveText(summary.subtotal);
      await expect(shop.checkout.tax).toHaveText(summary.tax);
      await expect(shop.checkout.total).toHaveText(summary.total);

      await shop.checkout.finish();
      await expect(page).toHaveURL(/\/checkout-complete\.html$/);
      await expect(shop.checkout.completeHeader).toHaveText('Thank you for your order!');
    });
  });

  test('stops when the postal code is missing', async ({ shop, page }) => {
    await shop.inventory.add(products.onesie.name);
    await shop.inventory.openCart();
    await shop.cart.checkout();

    await shop.checkout.fillCustomer({ ...customer, postalCode: '' });
    await shop.checkout.continue();

    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(shop.checkout.error).toHaveText('Error: Postal Code is required');
  });
});
