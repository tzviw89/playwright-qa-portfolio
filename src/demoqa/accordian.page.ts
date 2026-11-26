import type { Locator, Page } from '@playwright/test';

/**
 * The Widgets page is spelled Accordian and served at /accordian.
 * Heading buttons have no id and no aria-controls, so each item is
 * the accordion-item that contains that button.
 */
export class AccordianPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/accordian');
  }

  private item(name: string): Locator {
    return this.page.locator('.accordion-item').filter({
      has: this.page.getByRole('button', { name, exact: true }),
    });
  }

  heading(name: string): Locator {
    return this.item(name).getByRole('button', { name, exact: true });
  }

  /** The paragraph under that heading. Hidden while the section is collapsed. */
  body(name: string): Locator {
    return this.item(name).locator('.accordion-body');
  }

  async toggle(name: string): Promise<void> {
    await this.heading(name).click();
  }
}
