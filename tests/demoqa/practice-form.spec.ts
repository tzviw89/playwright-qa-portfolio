import { student } from '../../src/demoqa/catalog';
import { expect, test } from '../../src/demoqa/test';

test.describe('practice form', () => {
  test('submits required fields and shows them in the confirmation modal', { tag: '@smoke' }, async ({
    practiceForm,
  }) => {
    await practiceForm.fillRequired(student);
    await practiceForm.submitForm();

    await expect(practiceForm.confirmationTitle).toHaveText('Thanks for submitting the form');
    await expect(practiceForm.confirmationValue('Student Name')).toHaveText(
      `${student.firstName} ${student.lastName}`,
    );
    await expect(practiceForm.confirmationValue('Student Email')).toHaveText(student.email!);
    await expect(practiceForm.confirmationValue('Gender')).toHaveText(student.gender);
    await expect(practiceForm.confirmationValue('Mobile')).toHaveText(student.mobile);
  });

  test('stays on the form when a required field is missing', async ({ practiceForm, page }) => {
    await practiceForm.fillRequired({ ...student, firstName: '' });
    await practiceForm.submitForm();

    await expect(practiceForm.confirmationTitle).toHaveCount(0);
    await expect(page.locator('#firstName:invalid')).toBeVisible();
    await expect(page).toHaveURL(/\/automation-practice-form$/);
  });
});
