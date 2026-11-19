import type { Locator, Page } from '@playwright/test';
import type { TextBoxEntry } from './catalog';

export class TextBoxPage {
  readonly fullName: Locator;
  readonly email: Locator;
  readonly currentAddress: Locator;
  readonly permanentAddress: Locator;
  readonly submit: Locator;
  /** Paragraphs inside the output block. Empty until a valid submit. */
  readonly outputLines: Locator;

  constructor(private readonly page: Page) {
    this.fullName = page.locator('#userName');
    this.email = page.locator('#userEmail');
    // The output block reuses these ids, so the fields stay scoped to the form wrappers.
    this.currentAddress = page.locator('#currentAddress-wrapper textarea');
    this.permanentAddress = page.locator('#permanentAddress-wrapper textarea');
    this.submit = page.locator('#submit');
    this.outputLines = page.locator('#output p');
  }

  async open(): Promise<void> {
    await this.page.goto('/text-box');
  }

  async fill(entry: TextBoxEntry): Promise<void> {
    await this.fullName.fill(entry.fullName);
    await this.email.fill(entry.email);
    await this.currentAddress.fill(entry.currentAddress);
    await this.permanentAddress.fill(entry.permanentAddress);
  }

  async submitForm(): Promise<void> {
    await this.submit.scrollIntoViewIfNeeded();
    await this.submit.click();
  }
}
