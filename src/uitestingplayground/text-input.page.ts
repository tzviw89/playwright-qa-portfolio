import type { Locator, Page } from '@playwright/test';

export class TextInputPage {
  readonly nameInput: Locator;
  /** The accessible name is replaced on click, so the button is not pinned to it. */
  readonly button: Locator;

  constructor(private readonly page: Page) {
    this.nameInput = page.getByRole('textbox', { name: 'Set New Button Name', exact: true });
    this.button = page.locator('section').getByRole('button');
  }

  async open(): Promise<void> {
    await this.page.goto('/textinput');
  }

  async setButtonName(name: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.button.click();
  }
}
