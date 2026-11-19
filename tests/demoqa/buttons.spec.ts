import { expect, test } from '../../src/demoqa/test';

test.describe('buttons', () => {
  test('shows a message for double click, right click, and dynamic click', async ({ buttons }) => {
    await buttons.doubleClick();
    await expect(buttons.doubleClickMessage).toHaveText('You have done a double click');

    await buttons.rightClick();
    await expect(buttons.rightClickMessage).toHaveText('You have done a right click');

    await buttons.dynamicClick();
    await expect(buttons.dynamicClickMessage).toHaveText('You have done a dynamic click');
  });
});
