import { test as base, expect } from '@playwright/test';
import { users } from './catalog';
import { CartPage } from './cart.page';
import { CheckoutPage } from './checkout.page';
import { InventoryPage } from './inventory.page';
import { LoginPage } from './login.page';

type SauceFixtures = {
  loginPage: LoginPage;
  /** Inventory with standard_user already signed in. */
  shop: {
    inventory: InventoryPage;
    cart: CartPage;
    checkout: CheckoutPage;
  };
};

export const test = base.extend<SauceFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await use(loginPage);
  },

  shop: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.signIn(users.standard.username, users.standard.password);

    const inventory = new InventoryPage(page);
    await expect(inventory.title).toHaveText('Products');

    await use({
      inventory,
      cart: new CartPage(page),
      checkout: new CheckoutPage(page),
    });
  },
});

export { expect };
