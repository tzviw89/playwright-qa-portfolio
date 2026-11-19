import { textBoxEntry } from '../../src/demoqa/catalog';
import { expect, test } from '../../src/demoqa/test';

test.describe('text box', () => {
  test('shows the submitted name, email, and addresses', async ({ textBox }) => {
    await textBox.fill(textBoxEntry);
    await textBox.submitForm();

    await expect(textBox.outputLines).toHaveText([
      `Name:${textBoxEntry.fullName}`,
      `Email:${textBoxEntry.email}`,
      `Current Address :${textBoxEntry.currentAddress}`,
      // The page spells this label "Permananet".
      `Permananet Address :${textBoxEntry.permanentAddress}`,
    ]);
  });

  test('shows an error state for an invalid email and hides the output', async ({ textBox }) => {
    await textBox.fill({ ...textBoxEntry, email: 'not-an-email' });
    await textBox.submitForm();

    await expect(textBox.email).toHaveClass(/field-error/);
    await expect(textBox.outputLines).toHaveCount(0);
  });
});
