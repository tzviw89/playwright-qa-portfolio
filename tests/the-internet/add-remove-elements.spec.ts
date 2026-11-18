import { expect, test } from '@playwright/test';
import { AddRemoveElementsPage } from '../../src/the-internet/add-remove-elements.page';

test.describe('add/remove elements', () => {
  test('adds Delete buttons and removes them one at a time', async ({ page }) => {
    const elements = new AddRemoveElementsPage(page);
    await elements.open();

    await expect(elements.deleteButtons).toHaveCount(0);

    await elements.addElement();
    await expect(elements.deleteButtons).toHaveCount(1);
    await expect(elements.deleteButtons).toHaveText(['Delete']);

    await elements.addElement();
    await expect(elements.deleteButtons).toHaveCount(2);
    await expect(elements.deleteButtons).toHaveText(['Delete', 'Delete']);

    await elements.deleteElement();
    await expect(elements.deleteButtons).toHaveCount(1);

    await elements.deleteElement();
    await expect(elements.deleteButtons).toHaveCount(0);
  });
});
