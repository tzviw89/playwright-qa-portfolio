import type { Locator, Page } from '@playwright/test';

export class AddRemoveElementsPage {
  readonly addButton: Locator;
  readonly deleteButtons: Locator;

  constructor(private readonly page: Page) {
    this.addButton = page.getByRole('button', { name: 'Add Element' });
    this.deleteButtons = page.locator('#elements').getByRole('button', { name: 'Delete' });
  }

  async open(): Promise<void> {
    await this.page.goto('/add_remove_elements/');
  }

  async addElement(): Promise<void> {
    await this.addButton.click();
  }

  async deleteElement(): Promise<void> {
    await this.deleteButtons.first().click();
  }
}
