import type { Locator, Page } from '@playwright/test';

export class SecurePage {
  readonly heading: Locator;
  readonly flash: Locator;
  readonly logout: Locator;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { name: 'Secure Area', exact: true });
    this.flash = page.locator('#flash');
    this.logout = page.getByRole('link', { name: 'Logout' });
  }
}
