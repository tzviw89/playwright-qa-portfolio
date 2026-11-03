import { expect, test } from '@playwright/test';
import { DynamicLoadingPage } from '../../src/the-internet/dynamic-loading.page';

test.describe('dynamic loading', () => {
  test('renders the heading only after Start', { tag: '@smoke' }, async ({ page }) => {
    const loading = new DynamicLoadingPage(page);
    await loading.open();

    await expect(loading.message).toHaveCount(0);

    await loading.start();
    await expect(loading.message).toHaveText('Hello World!', { timeout: 15_000 });
  });
});
