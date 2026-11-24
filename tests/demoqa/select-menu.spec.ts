import { expect, test } from '../../src/demoqa/test';

test.describe('select menu', () => {
  test('replaces a grouped option, selects a title, and changes the old-style color', async ({
    selectMenu,
  }) => {
    await expect(selectMenu.valueLabel).toHaveCount(0);
    await expect(selectMenu.titleLabel).toHaveCount(0);
    await expect(selectMenu.oldStyle.locator('option:checked')).toHaveText('Red');

    await selectMenu.choose(selectMenu.valueMenu, 'Group 2, option 1');
    await expect(selectMenu.valueLabel).toHaveText('Group 2, option 1');

    await selectMenu.choose(selectMenu.valueMenu, 'Another root option');
    await expect(selectMenu.valueLabel).toHaveText('Another root option');

    await selectMenu.choose(selectMenu.titleMenu, 'Prof.');
    await expect(selectMenu.titleLabel).toHaveText('Prof.');

    await selectMenu.chooseOldStyle('Indigo');
    await expect(selectMenu.oldStyle.locator('option:checked')).toHaveText('Indigo');
  });

  test('selects several colors, removes one, and selects several cars', async ({ selectMenu }) => {
    await expect(selectMenu.selectedColors).toHaveCount(0);
    await expect(selectMenu.cars.locator('option:checked')).toHaveCount(0);

    await selectMenu.chooseColors(['Green', 'Black']);
    await expect(selectMenu.selectedColors).toHaveText(['Green', 'Black']);

    await selectMenu.removeColor('Black');
    await expect(selectMenu.selectedColors).toHaveText(['Green']);

    await selectMenu.chooseCars(['Saab', 'Audi']);
    await expect(selectMenu.cars.locator('option:checked')).toHaveText(['Saab', 'Audi']);
  });
});
