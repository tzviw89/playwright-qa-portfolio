import { expect, test } from '@playwright/test';
import { HoversPage } from '../../src/the-internet/hovers.page';

test.describe('hovers', () => {
  test("shows that user's name and profile link while the pointer is over an avatar", async ({
    page,
  }) => {
    const hovers = new HoversPage(page);
    await hovers.open();

    const user1 = hovers.user(1);
    const user2 = hovers.user(2);
    const user3 = hovers.user(3);

    await expect(user1.caption).toBeHidden();
    await expect(user1.profile).toBeHidden();
    await expect(user2.caption).toBeHidden();
    await expect(user3.caption).toBeHidden();

    await user1.avatar.hover();
    await expect(user1.caption).toBeVisible();
    await expect(user1.caption).toHaveText('name: user1');
    await expect(user1.profile).toBeVisible();
    await expect(user1.profile).toHaveText('View profile');
    await expect(user1.profile).toHaveAttribute('href', '/users/1');
    await expect(user2.caption).toBeHidden();

    await user2.avatar.hover();
    await expect(user2.caption).toHaveText('name: user2');
    await expect(user2.profile).toHaveAttribute('href', '/users/2');
    await expect(user1.caption).toBeHidden();

    await user3.avatar.hover();
    await expect(user3.caption).toHaveText('name: user3');
    await expect(user3.profile).toHaveAttribute('href', '/users/3');
    await expect(user2.caption).toBeHidden();
  });
});
