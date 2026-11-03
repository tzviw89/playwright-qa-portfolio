import { expect, test } from '@playwright/test';
import { demoUser } from '../../src/the-internet/accounts';
import { LoginPage } from '../../src/the-internet/login.page';
import { SecurePage } from '../../src/the-internet/secure.page';

test.describe('form authentication', () => {
  test('demo user can enter and leave the secure area', { tag: '@smoke' }, async ({ page }) => {
    const login = new LoginPage(page);
    const secure = new SecurePage(page);

    await login.open();
    await login.signIn(demoUser.username, demoUser.password);

    await expect(page).toHaveURL(/\/secure$/);
    await expect(secure.heading).toBeVisible();
    await expect(secure.flash).toContainText('You logged into a secure area!');

    await secure.logout.click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(login.flash).toContainText('You logged out of the secure area!');
  });

  test('a wrong password stays on the login form', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.signIn(demoUser.username, 'wrong-password');

    await expect(page).toHaveURL(/\/login$/);
    await expect(login.flash).toContainText('Your password is invalid!');
  });
});
