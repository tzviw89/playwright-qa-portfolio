import type { Locator, Page } from '@playwright/test';

/** Hide removes, collapses, covers, or restyles the other buttons. */
export class VisibilityPage {
  readonly hideButton: Locator;
  readonly removed: Locator;
  readonly zeroWidth: Locator;
  readonly overlapped: Locator;
  readonly overlap: Locator;
  readonly transparent: Locator;
  readonly visibilityHidden: Locator;
  readonly displayNone: Locator;
  readonly offscreen: Locator;

  constructor(private readonly page: Page) {
    const button = (name: string): Locator =>
      page.getByRole('button', { name, exact: true, includeHidden: true });

    this.hideButton = button('Hide');
    this.removed = button('Removed');
    this.zeroWidth = button('Zero Width');
    this.overlapped = button('Overlapped');
    this.overlap = page.locator('#hidingLayer');
    this.transparent = button('Opacity 0');
    this.visibilityHidden = button('Visibility Hidden');
    this.displayNone = button('Display None');
    this.offscreen = button('Offscreen');
  }

  async open(): Promise<void> {
    await this.page.goto('/visibility');
  }

  async hide(): Promise<void> {
    await this.hideButton.click();
  }
}
