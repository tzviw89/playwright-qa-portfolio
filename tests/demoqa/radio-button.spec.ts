import { expect, test } from '../../src/demoqa/test';

test.describe('radio button', () => {
  test('selects Yes and Impressive and leaves No disabled', async ({ radioButton }) => {
    await expect(radioButton.no).toBeDisabled();
    await expect(radioButton.no).not.toBeChecked();

    await radioButton.selectYes();
    await expect(radioButton.yes).toBeChecked();
    await expect(radioButton.result).toHaveText('You have selected Yes');

    await radioButton.selectImpressive();
    await expect(radioButton.impressive).toBeChecked();
    await expect(radioButton.yes).not.toBeChecked();
    await expect(radioButton.result).toHaveText('You have selected Impressive');

    await expect(radioButton.no).toBeDisabled();
    await expect(radioButton.no).not.toBeChecked();
  });
});
