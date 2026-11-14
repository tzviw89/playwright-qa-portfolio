import { expect, test } from '@playwright/test';
import { VisibilityPage } from '../../src/uitestingplayground/visibility.page';

test.describe('visibility', () => {
  test('hides buttons that are removed, collapsed, or styled out', async ({ page }) => {
    const visibility = new VisibilityPage(page);
    await visibility.open();

    await expect(visibility.removed).toBeVisible();
    await expect(visibility.zeroWidth).toBeVisible();
    await expect(visibility.visibilityHidden).toBeVisible();
    await expect(visibility.displayNone).toBeVisible();
    await expect(visibility.transparent).toBeVisible();
    await expect(visibility.offscreen).toBeVisible();
    await expect(visibility.overlapped).toBeVisible();
    await expect(visibility.overlap).toBeHidden();

    await visibility.hide();

    await expect(visibility.removed).toHaveCount(0);
    await expect(visibility.zeroWidth).toBeHidden();
    await expect(visibility.visibilityHidden).toBeHidden();
    await expect(visibility.displayNone).toBeHidden();

    await expect(visibility.transparent).toBeVisible();
    await expect(visibility.transparent).toHaveCSS('opacity', '0');
    await expect(visibility.offscreen).toBeVisible();
    await expect(visibility.offscreen).toHaveCSS('top', '-9999px');
    await expect(visibility.overlapped).toBeVisible();
    await expect(visibility.overlap).toBeVisible();
  });
});
