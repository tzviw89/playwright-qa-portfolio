import type { Locator, Page } from '@playwright/test';
import type { SortOrder } from './catalog';

export class InventoryPage {
  readonly title: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly cart: Locator;
  readonly cartBadge: Locator;
  readonly sort: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.cart = page.getByRole('button', { name: /^Cart,/ });
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.sort = page.getByRole('combobox', { name: 'Sort products' });
  }

  private item(name: string): Locator {
    return this.page.getByTestId('inventory-item').filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }

  button(name: string, label: 'Add to cart' | 'Remove'): Locator {
    return this.item(name).getByRole('button', { name: label, exact: true });
  }

  async add(name: string): Promise<void> {
    await this.button(name, 'Add to cart').click();
  }

  async remove(name: string): Promise<void> {
    await this.button(name, 'Remove').click();
  }

  async sortBy(order: SortOrder): Promise<void> {
    await this.sort.selectOption(order);
  }

  async names(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async prices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((text) => Number(text.replace(/[^0-9.]/g, '')));
  }

  async openCart(): Promise<void> {
    await this.cart.click();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page.getByRole('button', { name: 'Logout' }).click();
  }
}
