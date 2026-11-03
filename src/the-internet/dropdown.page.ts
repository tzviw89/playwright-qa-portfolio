import type { Locator, Page } from '@playwright/test';

export class DropdownPage {
  readonly select: Locator;

  constructor(private readonly page: Page) {
    this.select = page.getByRole('combobox');
  }

  async open(): Promise<void> {
    await this.page.goto('/dropdown');
  }

  async choose(label: 'Option 1' | 'Option 2'): Promise<void> {
    await this.select.selectOption({ label });
  }
}
