import { expect, test } from '@playwright/test';

test.describe('health', () => {
  test('ping reports the service is up', { tag: '@smoke' }, async ({ request }) => {
    const response = await request.get('/ping');

    // Restful Booker returns 201 Created for a healthy ping.
    expect(response.status()).toBe(201);
    expect(await response.text()).toBe('Created');
  });
});
