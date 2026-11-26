import { expect, test } from '../../src/demoqa/test';

test.describe('accordian', () => {
  test('starts with the first section open and the others collapsed', async ({ accordian }) => {
    await expect(accordian.heading('What is Lorem Ipsum?')).toHaveAttribute('aria-expanded', 'true');
    await expect(accordian.body('What is Lorem Ipsum?')).toContainText(
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    );

    await expect(accordian.heading('Where does it come from?')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(accordian.body('Where does it come from?')).toBeHidden();

    await expect(accordian.heading('Why do we use it?')).toHaveAttribute('aria-expanded', 'false');
    await expect(accordian.body('Why do we use it?')).toBeHidden();
  });

  test('opens one section at a time and can collapse the open section', async ({ accordian }) => {
    await accordian.toggle('Where does it come from?');

    await expect(accordian.heading('Where does it come from?')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(accordian.body('Where does it come from?')).toContainText(
      'Contrary to popular belief, Lorem Ipsum is not simply random text.',
    );
    await expect(accordian.heading('What is Lorem Ipsum?')).toHaveAttribute('aria-expanded', 'false');
    await expect(accordian.body('What is Lorem Ipsum?')).toBeHidden();
    await expect(accordian.body('Why do we use it?')).toBeHidden();

    await accordian.toggle('Why do we use it?');

    await expect(accordian.heading('Why do we use it?')).toHaveAttribute('aria-expanded', 'true');
    await expect(accordian.body('Why do we use it?')).toContainText(
      'It is a long established fact that a reader will be distracted',
    );
    await expect(accordian.body('Where does it come from?')).toBeHidden();

    await accordian.toggle('Why do we use it?');

    await expect(accordian.heading('Why do we use it?')).toHaveAttribute('aria-expanded', 'false');
    await expect(accordian.body('What is Lorem Ipsum?')).toBeHidden();
    await expect(accordian.body('Where does it come from?')).toBeHidden();
    await expect(accordian.body('Why do we use it?')).toBeHidden();
  });
});
