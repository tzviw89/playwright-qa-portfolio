import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  private line(name: string): Locator {
    return this.page.getByTestId('inventory-item').filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }

  async remove(name: string): Promise<void> {
    await this.line(name).getByRole('button', { name: 'Remove' }).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
