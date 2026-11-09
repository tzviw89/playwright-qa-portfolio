import { expect, test } from '@playwright/test';
import { DynamicControlsPage } from '../../src/the-internet/dynamic-controls.page';

test.describe('dynamic controls', () => {
  test('removes and restores the checkbox', async ({ page }) => {
    const controls = new DynamicControlsPage(page);
    await controls.open();

    await expect(controls.checkbox).toBeVisible();
    await expect(controls.removeAddButton).toHaveText('Remove');

    await controls.removeCheckbox();
    await expect(controls.message).toHaveText("It's gone!", { timeout: 15_000 });
    await expect(controls.checkbox).toHaveCount(0);
    await expect(controls.removeAddButton).toHaveText('Add');

    await controls.addCheckbox();
    await expect(controls.message).toHaveText("It's back!", { timeout: 15_000 });
    await expect(controls.checkbox).toBeVisible();
    await expect(controls.removeAddButton).toHaveText('Remove');
  });

  test('enables and disables the text input', async ({ page }) => {
    const controls = new DynamicControlsPage(page);
    await controls.open();

    await expect(controls.textInput).toBeDisabled();
    await expect(controls.enableDisableButton).toHaveText('Enable');

    await controls.enableInput();
    await expect(controls.message).toHaveText("It's enabled!", { timeout: 15_000 });
    await expect(controls.textInput).toBeEnabled();
    await expect(controls.enableDisableButton).toHaveText('Disable');

    await controls.textInput.fill('ready');
    await expect(controls.textInput).toHaveValue('ready');

    await controls.disableInput();
    await expect(controls.message).toHaveText("It's disabled!", { timeout: 15_000 });
    await expect(controls.textInput).toBeDisabled();
    await expect(controls.enableDisableButton).toHaveText('Enable');
  });
});
