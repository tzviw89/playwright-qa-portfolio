import type { Locator, Page } from '@playwright/test';

export class KeyPressesPage {
  readonly input: Locator;
  readonly result: Locator;

  constructor(private readonly page: Page) {
    this.input = page.getByRole('textbox');
    this.result = page.locator('#result');
  }

  async open(): Promise<void> {
    await this.page.goto('/key_presses');
  }

  async press(key: string): Promise<void> {
    await this.input.press(key);
  }
}
