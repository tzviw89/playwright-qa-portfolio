import type { Locator, Page } from '@playwright/test';

/** Example 2: the heading is inserted about five seconds after Start. */
export class DynamicLoadingPage {
  readonly startButton: Locator;
  readonly message: Locator;

  constructor(private readonly page: Page) {
    this.startButton = page.getByRole('button', { name: 'Start' });
    this.message = page.getByRole('heading', { name: 'Hello World!' });
  }

  async open(): Promise<void> {
    await this.page.goto('/dynamic_loading/2');
  }

  async start(): Promise<void> {
    await this.startButton.click();
  }
}
