import type { Locator, Page } from '@playwright/test';

/** Each caption stays hidden until the pointer is over that avatar. */
export class HoversPage {
  private readonly figures: Locator;

  constructor(private readonly page: Page) {
    this.figures = page.locator('.figure');
  }

  user(n: 1 | 2 | 3): { avatar: Locator; caption: Locator; profile: Locator } {
    const figure = this.figures.nth(n - 1);
    return {
      avatar: figure.getByRole('img', { name: 'User Avatar' }),
      caption: figure.getByRole('heading', { includeHidden: true }),
      profile: figure.getByRole('link', { name: 'View profile', includeHidden: true }),
    };
  }

  async open(): Promise<void> {
    await this.page.goto('/hovers');
  }
}
