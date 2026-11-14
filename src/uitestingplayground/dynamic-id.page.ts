import type { Locator, Page } from '@playwright/test';

/** The button id is generated per response, so the name is the stable handle. */
export class DynamicIdPage {
  readonly button: Locator;

  constructor(private readonly page: Page) {
    this.button = page.getByRole('button', { name: 'Button with Dynamic ID', exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('/dynamicid');
  }
}
