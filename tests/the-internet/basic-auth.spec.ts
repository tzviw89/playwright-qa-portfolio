import { expect, test } from '@playwright/test';
import { basicAuthUser } from '../../src/the-internet/accounts';
import { BasicAuthPage } from '../../src/the-internet/basic-auth.page';

test.describe('basic auth', () => {
  test('a request without credentials returns 401', async ({ request }) => {
    const response = await request.get('/basic_auth');
    expect(response.status()).toBe(401);
  });

  test.describe('with the published demo credentials', () => {
    test.use({
      httpCredentials: {
        username: basicAuthUser.username,
        password: basicAuthUser.password,
        origin: 'https://the-internet.herokuapp.com',
      },
    });

    test('shows the congratulations message', async ({ page }) => {
      const basicAuth = new BasicAuthPage(page);
      await basicAuth.open();

      await expect(page).toHaveURL(/\/basic_auth$/);
      await expect(basicAuth.message).toHaveText(
        'Congratulations! You must have the proper credentials.',
      );
    });
  });
});
