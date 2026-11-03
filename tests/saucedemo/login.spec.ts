import { catalog, users } from '../../src/saucedemo/catalog';
import { InventoryPage } from '../../src/saucedemo/inventory.page';
import { expect, test } from '../../src/saucedemo/test';

test.describe('login', () => {
  test('standard user reaches the inventory', { tag: '@smoke' }, async ({ loginPage, page }) => {
    await loginPage.signIn(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    const inventory = new InventoryPage(page);
    await expect(inventory.title).toHaveText('Products');
    await expect(inventory.itemNames).toHaveCount(catalog.length);
  });

  test('locked out user is stopped on the login form', async ({ loginPage, page }) => {
    await loginPage.signIn(users.lockedOut.username, users.lockedOut.password);

    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.error).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('wrong password is rejected', async ({ loginPage, page }) => {
    await loginPage.signIn(users.standard.username, 'not-the-password');

    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.error).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  test('blank username is rejected before the password is checked', async ({ loginPage }) => {
    await loginPage.signIn('', users.standard.password);

    await expect(loginPage.error).toHaveText('Epic sadface: Username is required');
  });
});
