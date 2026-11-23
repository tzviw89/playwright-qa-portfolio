import type { Locator, Page } from '@playwright/test';

export class CheckboxPage {
  /** Names under "You have selected". The block is absent until a box is checked. */
  readonly selected: Locator;

  constructor(private readonly page: Page) {
    this.selected = page.locator('#result .text-success');
  }

  async open(): Promise<void> {
    await this.page.goto('/checkbox');
  }

  /**
   * The treeitem's accessible name repeats the checkbox label ("Select Home Home"),
   * so the visible title is the stable match.
   */
  treeItem(title: string): Locator {
    return this.page.getByRole('treeitem').filter({
      has: this.page.getByText(title, { exact: true }),
    });
  }

  checkbox(title: string): Locator {
    return this.page.getByRole('checkbox', { name: `Select ${title}`, exact: true });
  }

  async expand(title: string): Promise<void> {
    // The disclosure icon is a span with no accessible name.
    await this.treeItem(title).locator('.rc-tree-switcher').click();
  }

  async toggle(title: string): Promise<void> {
    await this.checkbox(title).click();
  }
}
