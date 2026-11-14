import type { Locator, Page } from '@playwright/test';

/** The label is inserted about fifteen seconds after the click. */
export class ClientDelayPage {
  readonly trigger: Locator;
  readonly result: Locator;

  constructor(private readonly page: Page) {
    this.trigger = page.getByRole('button', {
      name: 'Button Triggering Client Side Logic',
      exact: true,
    });
    this.result = page.getByText('Data calculated on the client side.', { exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('/clientdelay');
  }

  async start(): Promise<void> {
    await this.trigger.click();
  }
}
