import type { Locator, Page } from '@playwright/test';

export class JavaScriptAlertsPage {
  readonly alertButton: Locator;
  readonly confirmButton: Locator;
  readonly promptButton: Locator;
  readonly result: Locator;

  constructor(private readonly page: Page) {
    this.alertButton = page.getByRole('button', { name: 'Click for JS Alert' });
    this.confirmButton = page.getByRole('button', { name: 'Click for JS Confirm' });
    this.promptButton = page.getByRole('button', { name: 'Click for JS Prompt' });
    this.result = page.locator('#result');
  }

  async open(): Promise<void> {
    await this.page.goto('/javascript_alerts');
  }
}
