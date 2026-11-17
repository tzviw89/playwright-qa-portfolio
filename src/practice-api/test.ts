import { expect, test as base } from '@playwright/test';
import type { ProductPage } from './catalog';
import { listProducts } from './client';

type PracticeFixtures = {
  /**
   * First page of GET /products. Specs that need a real id read this
   * instead of repeating the list call. Nothing is created or deleted.
   */
  productPage: ProductPage;
};

export const test = base.extend<PracticeFixtures>({
  productPage: async ({ request }, use) => {
    const response = await listProducts(request);
    expect(response.status()).toBe(200);

    const body = (await response.json()) as ProductPage;
    expect(body.data.length).toBeGreaterThan(0);

    await use(body);
  },
});

export { expect };
