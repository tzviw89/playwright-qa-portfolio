import type { Locator, Page } from '@playwright/test';

export class ButtonsPage {
  readonly doubleClickButton: Locator;
  readonly rightClickButton: Locator;
  /** The plain click target's id is generated, so it is pinned to its name. */
  readonly clickMeButton: Locator;
  readonly doubleClickMessage: Locator;
  readonly rightClickMessage: Locator;
  readonly dynamicClickMessage: Locator;

  constructor(private readonly page: Page) {
    this.doubleClickButton = page.locator('#doubleClickBtn');
    this.rightClickButton = page.locator('#rightClickBtn');
    this.clickMeButton = page.getByRole('button', { name: 'Click Me', exact: true });
    this.doubleClickMessage = page.locator('#doubleClickMessage');
    this.rightClickMessage = page.locator('#rightClickMessage');
    this.dynamicClickMessage = page.locator('#dynamicClickMessage');
  }

  async open(): Promise<void> {
    await this.page.goto('/buttons');
  }

  async doubleClick(): Promise<void> {
    await this.doubleClickButton.dblclick();
  }

  async rightClick(): Promise<void> {
    await this.rightClickButton.click({ button: 'right' });
  }

  async dynamicClick(): Promise<void> {
    await this.clickMeButton.click();
  }
}
