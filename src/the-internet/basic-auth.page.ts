import type { Locator, Page } from '@playwright/test';

export class BasicAuthPage {
  readonly message: Locator;

  constructor(private readonly page: Page) {
    this.message = page.getByRole('main').getByRole('paragraph');
  }

  async open(): Promise<void> {
    await this.page.goto('/basic_auth');
  }
}
