import { expect, test } from '@playwright/test';
import { DropdownPage } from '../../src/the-internet/dropdown.page';

test.describe('dropdown', () => {
  test('selects an option', async ({ page }) => {
    const dropdown = new DropdownPage(page);
    await dropdown.open();

    await expect(dropdown.select).toHaveValue('');

    await dropdown.choose('Option 2');
    await expect(dropdown.select).toHaveValue('2');

    await dropdown.choose('Option 1');
    await expect(dropdown.select).toHaveValue('1');
  });
});
