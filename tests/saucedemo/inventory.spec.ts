import { catalog, products, type Product } from '../../src/saucedemo/catalog';
import { LoginPage } from '../../src/saucedemo/login.page';
import { expect, test } from '../../src/saucedemo/test';

test.describe('inventory', () => {
  test('opens sorted by name, A to Z', async ({ shop }) => {
    const expected = byName(catalog);

    await expect(shop.inventory.sort).toHaveValue('az');
    expect(await shop.inventory.names()).toEqual(names(expected));
    expect(await shop.inventory.prices()).toEqual(expected.map((item) => item.price));
  });

  test('sorts by name, Z to A', async ({ shop }) => {
    await shop.inventory.sortBy('za');

    expect(await shop.inventory.names()).toEqual(names([...catalog].sort(nameDescending)));
  });

  test('sorts by price, low to high', async ({ shop }) => {
    await shop.inventory.sortBy('lohi');

    // Ties keep source order. Swag Labs sorts the original catalog, and the sort is stable.
    const expected = [...catalog].sort((a, b) => a.price - b.price || a.id - b.id);
    expect(await shop.inventory.names()).toEqual(names(expected));
  });

  test('cart badge follows add and remove', async ({ shop }) => {
    await expect(shop.inventory.cartBadge).toHaveCount(0);

    await shop.inventory.add(products.backpack.name);
    await expect(shop.inventory.cartBadge).toHaveText('1');

    await shop.inventory.add(products.bikeLight.name);
    await expect(shop.inventory.cartBadge).toHaveText('2');

    await shop.inventory.remove(products.backpack.name);
    await expect(shop.inventory.cartBadge).toHaveText('1');
    await expect(shop.inventory.button(products.backpack.name, 'Add to cart')).toBeVisible();
    await expect(shop.inventory.button(products.bikeLight.name, 'Remove')).toBeVisible();
  });

  test('logs out to the login form', async ({ shop, page }) => {
    await shop.inventory.logout();

    const loginPage = new LoginPage(page);
    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.username).toBeVisible();
  });
});

function byName(items: readonly Product[]): Product[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}

function nameDescending(a: Product, b: Product): number {
  return b.name.localeCompare(a.name);
}

function names(items: readonly Product[]): string[] {
  return items.map((item) => item.name);
}
