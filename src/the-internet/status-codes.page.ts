import type { Locator, Page } from '@playwright/test';

export const statusCodes = [200, 301, 404, 500] as const;
export type StatusCode = (typeof statusCodes)[number];

export class StatusCodesPage {
  readonly result: Locator;

  constructor(private readonly page: Page) {
    this.result = page.getByRole('main').getByRole('paragraph');
  }

  codeLink(code: StatusCode): Locator {
    return this.page.getByRole('link', { name: String(code), exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('/status_codes');
  }

  async openCode(code: StatusCode): Promise<void> {
    await this.codeLink(code).click();
  }
}
