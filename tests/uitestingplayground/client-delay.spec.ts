import { expect, test } from '@playwright/test';
import { ClientDelayPage } from '../../src/uitestingplayground/client-delay.page';

test.describe('client side delay', () => {
  test('shows the label after client-side processing', async ({ page }) => {
    const delay = new ClientDelayPage(page);
    await delay.open();

    await expect(delay.result).toHaveCount(0);

    await delay.start();
    await expect(delay.result).toBeVisible({ timeout: 20_000 });
  });
});
