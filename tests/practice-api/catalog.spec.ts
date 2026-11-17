import type { Brand, Category } from '../../src/practice-api/catalog';
import { listBrands, listCategories } from '../../src/practice-api/client';
import { expect, test } from '../../src/practice-api/test';

test.describe('categories', () => {
  test('lists categories with parent ids', async ({ request, productPage }) => {
    const response = await listCategories(request);
    expect(response.status()).toBe(200);

    // Categories are a bare array. Products are the paginated object.
    const categories = (await response.json()) as Category[];
    expect(categories).toEqual(expect.any(Array));
    expect(categories.length).toBeGreaterThan(0);

    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const category of categories) {
      expect(category).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          slug: expect.any(String),
        }),
      );
      expect(category.id.length).toBeGreaterThan(0);
      expect(category.name.length).toBeGreaterThan(0);
      expect(category.slug.length).toBeGreaterThan(0);
      expect(category.parent_id === null || typeof category.parent_id === 'string').toBe(true);
      expect(ids.has(category.id)).toBe(false);
      expect(slugs.has(category.slug)).toBe(false);
      ids.add(category.id);
      slugs.add(category.slug);
    }

    for (const category of categories) {
      if (category.parent_id === null) continue;
      expect(ids.has(category.parent_id)).toBe(true);
      expect(category.parent_id).not.toBe(category.id);
    }

    for (const product of productPage.data) {
      expect(product.category.id).toEqual(expect.any(String));
      expect(ids.has(product.category.id)).toBe(true);
    }
  });
});

test.describe('brands', () => {
  test('lists brands referenced by products', async ({ request, productPage }) => {
    const response = await listBrands(request);
    expect(response.status()).toBe(200);

    const brands = (await response.json()) as Brand[];
    expect(brands).toEqual(expect.any(Array));
    expect(brands.length).toBeGreaterThan(0);

    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const brand of brands) {
      expect(brand).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          slug: expect.any(String),
        }),
      );
      expect(brand.id.length).toBeGreaterThan(0);
      expect(brand.name.length).toBeGreaterThan(0);
      expect(brand.slug.length).toBeGreaterThan(0);
      expect(ids.has(brand.id)).toBe(false);
      expect(slugs.has(brand.slug)).toBe(false);
      ids.add(brand.id);
      slugs.add(brand.slug);
    }

    for (const product of productPage.data) {
      expect(product.brand.id).toEqual(expect.any(String));
      expect(ids.has(product.brand.id)).toBe(true);
    }
  });
});
