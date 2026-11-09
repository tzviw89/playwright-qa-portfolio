import type { Locator, Page } from '@playwright/test';

/** Remove/add checkbox and enable/disable text field, each after a short delay. */
export class DynamicControlsPage {
  readonly checkbox: Locator;
  readonly removeAddButton: Locator;
  readonly textInput: Locator;
  readonly enableDisableButton: Locator;
  readonly message: Locator;

  constructor(private readonly page: Page) {
    this.checkbox = page.locator('#checkbox input[type="checkbox"], #checkbox[type="checkbox"]');
    this.removeAddButton = page.locator('#checkbox-example button');
    this.textInput = page.locator('#input-example input');
    this.enableDisableButton = page.locator('#input-example button');
    this.message = page.locator('#message');
  }

  async open(): Promise<void> {
    await this.page.goto('/dynamic_controls');
  }

  async removeCheckbox(): Promise<void> {
    await this.removeAddButton.click();
  }

  async addCheckbox(): Promise<void> {
    await this.removeAddButton.click();
  }

  async enableInput(): Promise<void> {
    await this.enableDisableButton.click();
  }

  async disableInput(): Promise<void> {
    await this.enableDisableButton.click();
  }
}
