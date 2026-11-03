import type { Locator, Page } from '@playwright/test';

export class CheckboxesPage {
  readonly first: Locator;
  readonly second: Locator;

  constructor(private readonly page: Page) {
    const boxes = page.getByRole('checkbox');
    this.first = boxes.nth(0);
    this.second = boxes.nth(1);
  }

  async open(): Promise<void> {
    await this.page.goto('/checkboxes');
  }
}
