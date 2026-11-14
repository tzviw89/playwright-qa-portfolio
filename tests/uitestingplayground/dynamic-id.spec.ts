import { expect, test } from '@playwright/test';
import { DynamicIdPage } from '../../src/uitestingplayground/dynamic-id.page';

test.describe('dynamic id', () => {
  test('clicks the button by name when its id changes', { tag: '@smoke' }, async ({ page }) => {
    const dynamicId = new DynamicIdPage(page);
    await dynamicId.open();

    await expect(dynamicId.button).toBeVisible();
    const generatedId = await dynamicId.button.getAttribute('id');
    expect(generatedId).toMatch(/^[0-9a-f-]+$/i);

    await dynamicId.button.click();
    await page.reload();

    await expect(dynamicId.button).toBeVisible();
    await expect(dynamicId.button).not.toHaveAttribute('id', generatedId ?? '');
  });
});
