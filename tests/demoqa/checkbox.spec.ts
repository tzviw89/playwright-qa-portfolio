import { expect, test } from '../../src/demoqa/test';

test.describe('check box', () => {
  test('lists a checked leaf and marks its parents mixed', async ({ checkbox }) => {
    await expect(checkbox.selected).toHaveCount(0);
    await expect(checkbox.checkbox('Home')).not.toBeChecked();
    await expect(checkbox.treeItem('Desktop')).toHaveCount(0);

    await checkbox.expand('Home');
    await expect(checkbox.treeItem('Home')).toHaveAttribute('aria-expanded', 'true');

    await checkbox.expand('Desktop');
    await checkbox.toggle('Notes');

    await expect(checkbox.checkbox('Notes')).toBeChecked();
    await expect(checkbox.checkbox('Commands')).not.toBeChecked();
    await expect(checkbox.checkbox('Desktop')).toBeChecked({ indeterminate: true });
    await expect(checkbox.checkbox('Home')).toBeChecked({ indeterminate: true });
    await expect(checkbox.selected).toHaveText(['notes']);
  });

  test('checking a parent selects its children and clears when one child is unchecked', async ({
    checkbox,
  }) => {
    await checkbox.expand('Home');
    await checkbox.expand('Desktop');
    await checkbox.toggle('Desktop');

    await expect(checkbox.checkbox('Desktop')).toBeChecked();
    await expect(checkbox.checkbox('Notes')).toBeChecked();
    await expect(checkbox.checkbox('Commands')).toBeChecked();
    await expect(checkbox.checkbox('Documents')).not.toBeChecked();
    await expect(checkbox.checkbox('Home')).toBeChecked({ indeterminate: true });
    await expect(checkbox.selected).toHaveText(['desktop', 'notes', 'commands']);

    await checkbox.toggle('Commands');

    await expect(checkbox.checkbox('Commands')).not.toBeChecked();
    await expect(checkbox.checkbox('Notes')).toBeChecked();
    await expect(checkbox.checkbox('Desktop')).toBeChecked({ indeterminate: true });
    await expect(checkbox.selected).toHaveText(['notes']);
  });
});
