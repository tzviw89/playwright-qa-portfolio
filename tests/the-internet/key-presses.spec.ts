import { expect, test } from '@playwright/test';
import { KeyPressesPage } from '../../src/the-internet/key-presses.page';

test.describe('key presses', () => {
  test('names the key that was pressed', async ({ page }) => {
    const keys = new KeyPressesPage(page);
    await keys.open();

    await expect(keys.result).toBeEmpty();

    await keys.press('A');
    await expect(keys.result).toHaveText('You entered: A');

    await keys.press('Escape');
    await expect(keys.result).toHaveText('You entered: ESCAPE');

    await keys.press('Tab');
    await expect(keys.result).toHaveText('You entered: TAB');

    await keys.press('Space');
    await expect(keys.result).toHaveText('You entered: SPACE');
  });
});
