import { expect, test } from '@playwright/test';
import { CheckboxesPage } from '../../src/the-internet/checkboxes.page';

test.describe('checkboxes', () => {
  test('toggles both boxes from their defaults', async ({ page }) => {
    const checkboxes = new CheckboxesPage(page);
    await checkboxes.open();

    await expect(checkboxes.first).not.toBeChecked();
    await expect(checkboxes.second).toBeChecked();

    await checkboxes.first.check();
    await checkboxes.second.uncheck();

    await expect(checkboxes.first).toBeChecked();
    await expect(checkboxes.second).not.toBeChecked();
  });
});
