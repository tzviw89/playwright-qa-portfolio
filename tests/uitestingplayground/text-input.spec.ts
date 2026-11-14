import { expect, test } from '@playwright/test';
import { TextInputPage } from '../../src/uitestingplayground/text-input.page';

test.describe('text input', () => {
  test('renames the button from the text field', { tag: '@smoke' }, async ({ page }) => {
    const textInput = new TextInputPage(page);
    await textInput.open();

    await expect(textInput.button).toHaveText(
      "Button That Should Change it's Name Based on Input Value",
    );

    await textInput.setButtonName('Renamed');
    await expect(textInput.button).toHaveText('Renamed');
  });
});
