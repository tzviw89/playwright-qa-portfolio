import type { Locator, Page } from '@playwright/test';

export class RadioButtonPage {
  readonly yes: Locator;
  readonly impressive: Locator;
  readonly no: Locator;
  readonly result: Locator;

  constructor(private readonly page: Page) {
    this.yes = page.locator('#yesRadio');
    this.impressive = page.locator('#impressiveRadio');
    this.no = page.locator('#noRadio');
    this.result = page.locator('p.mt-3');
  }

  async open(): Promise<void> {
    await this.page.goto('/radio-button');
  }

  async selectYes(): Promise<void> {
    // The input sits under its label; click the label text.
    await this.page.locator('label[for="yesRadio"]').click();
  }

  async selectImpressive(): Promise<void> {
    await this.page.locator('label[for="impressiveRadio"]').click();
  }
}
