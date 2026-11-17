import {
  unknownProductId,
  type ProductDetail,
  type ProductPage,
  type ProductSummary,
} from '../../src/practice-api/catalog';
import { getProduct, listProducts } from '../../src/practice-api/client';
import { expect, test } from '../../src/practice-api/test';

test.describe('products', () => {
  test('lists products with a pagination envelope', async ({ request }) => {
    const response = await listProducts(request);
    expect(response.status()).toBe(200);

    const first = (await response.json()) as ProductPage;
    expectProductPage(first);
    expect(first.current_page).toBe(1);
    expect(first.data.length).toBeGreaterThan(0);

    const firstIds = new Set<string>();
    for (const product of first.data) {
      expectProductSummary(product);
      expect(firstIds.has(product.id)).toBe(false);
      firstIds.add(product.id);
    }

    // A single page means the envelope already returned the whole catalog.
    if (first.last_page === 1) {
      expect(first.data.length).toBe(first.total);
      return;
    }

    const next = await listProducts(request, { page: 2 });
    expect(next.status()).toBe(200);

    const second = (await next.json()) as ProductPage;
    expectProductPage(second);
    expect(second.current_page).toBe(2);
    expect(second.total).toBe(first.total);
    expect(second.per_page).toBe(first.per_page);
    expect(second.data.length).toBeGreaterThan(0);

    const secondIds = new Set<string>();
    for (const product of second.data) {
      expectProductSummary(product);
      expect(secondIds.has(product.id)).toBe(false);
      expect(firstIds.has(product.id)).toBe(false);
      secondIds.add(product.id);
    }
  });

  test('reads a product by id', async ({ request, productPage }) => {
    const summary = productPage.data[0];
    expectProductSummary(summary);

    const response = await getProduct(request, summary.id);
    expect(response.status()).toBe(200);

    const detail = (await response.json()) as ProductDetail;
    expect(detail.id).toBe(summary.id);
    expect(detail.name).toBe(summary.name);
    expect(detail.description).toBe(summary.description);
    expect(detail.price).toBe(summary.price);
    expect(detail.is_location_offer).toBe(summary.is_location_offer);
    expect(detail.is_rental).toBe(summary.is_rental);
    expect(detail.co2_rating).toBe(summary.co2_rating);
    expect(detail.in_stock).toBe(summary.in_stock);
    expect(detail.is_eco_friendly).toBe(summary.is_eco_friendly);
    expect(detail.product_image).toEqual(
      expect.objectContaining({
        id: summary.product_image.id,
        file_name: summary.product_image.file_name,
        title: summary.product_image.title,
      }),
    );
    expect(detail.category).toEqual(
      expect.objectContaining({
        id: summary.category.id,
        name: summary.category.name,
        slug: summary.category.slug,
      }),
    );
    // The detail payload includes parent_id. The list row does not.
    const parentId = detail.category.parent_id;
    expect(parentId === null || typeof parentId === 'string').toBe(true);
    expect(detail.brand).toEqual(
      expect.objectContaining({
        id: summary.brand.id,
        name: summary.brand.name,
      }),
    );

    expect(detail.specs).toEqual(expect.any(Array));
    for (const spec of detail.specs) {
      expect(spec).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          product_id: summary.id,
          spec_name: expect.any(String),
          spec_value: expect.any(String),
        }),
      );
      expect(spec.id.length).toBeGreaterThan(0);
      expect(spec.spec_name.length).toBeGreaterThan(0);
      if (spec.spec_unit !== null) {
        expect(spec.spec_unit).toEqual(expect.any(String));
      }
    }
  });

  test('filters products with the q query', async ({ request, productPage }) => {
    const sample = productPage.data[0];
    expectProductSummary(sample);

    // `q` matches the product name, ignoring case. Using a name from the
    // list keeps the check from depending on a fixed catalog.
    const query = sample.name;
    const response = await listProducts(request, { q: query });
    expect(response.status()).toBe(200);

    const first = (await response.json()) as ProductPage;
    expectProductPage(first);
    expect(first.total).toBeGreaterThan(0);
    expect(first.current_page).toBe(1);

    const matched = [...first.data];
    for (let page = 2; page <= first.last_page; page += 1) {
      const next = await listProducts(request, { q: query, page });
      expect(next.status()).toBe(200);
      const body = (await next.json()) as ProductPage;
      expectProductPage(body);
      expect(body.current_page).toBe(page);
      expect(body.total).toBe(first.total);
      expect(body.per_page).toBe(first.per_page);
      matched.push(...body.data);
    }

    expect(matched).toHaveLength(first.total);
    expect(new Set(matched.map((product) => product.id)).size).toBe(matched.length);
    expect(matched.some((product) => product.id === sample.id)).toBe(true);

    const needle = query.toLowerCase();
    for (const product of matched) {
      expectProductSummary(product);
      expect(product.name.toLowerCase()).toContain(needle);
    }
  });

  test('returns 404 for an unknown product id', async ({ request }) => {
    const response = await getProduct(request, unknownProductId);

    expect(response.status()).toBe(404);
    const body = (await response.json()) as { message?: string };
    expect(body.message).toBe('Requested item not found');
  });
});

/** Page counts come from the payload. Nothing here hard-codes a catalog size. */
function expectProductPage(page: ProductPage): void {
  expect(Number.isInteger(page.current_page)).toBe(true);
  expect(page.current_page).toBeGreaterThanOrEqual(1);
  expect(Number.isInteger(page.last_page)).toBe(true);
  expect(page.last_page).toBeGreaterThanOrEqual(1);
  expect(Number.isInteger(page.per_page)).toBe(true);
  expect(page.per_page).toBeGreaterThan(0);
  expect(Number.isInteger(page.total)).toBe(true);
  expect(page.total).toBeGreaterThanOrEqual(0);
  expect(page.data).toEqual(expect.any(Array));
  expect(page.data.length).toBeLessThanOrEqual(page.per_page);

  const expectedLastPage = page.total === 0 ? 1 : Math.ceil(page.total / page.per_page);
  expect(page.last_page).toBe(expectedLastPage);

  if (page.data.length === 0) {
    expect(page.from).toBeNull();
    expect(page.to).toBeNull();
    return;
  }

  expect(page.current_page).toBeLessThanOrEqual(page.last_page);
  const from = (page.current_page - 1) * page.per_page + 1;
  expect(page.from).toBe(from);
  expect(page.to).toBe(from + page.data.length - 1);
  expect(page.to).toBeLessThanOrEqual(page.total);
}

function expectProductSummary(product: ProductSummary): void {
  expect(product.id).toEqual(expect.any(String));
  expect(product.id.length).toBeGreaterThan(0);
  expect(product.name).toEqual(expect.any(String));
  expect(product.name.length).toBeGreaterThan(0);
  expect(product.description).toEqual(expect.any(String));
  expect(product.price).toEqual(expect.any(Number));
  expect(Number.isFinite(product.price)).toBe(true);
  expect(product.price).toBeGreaterThanOrEqual(0);
  expect(product.is_location_offer).toEqual(expect.any(Boolean));
  expect(product.is_rental).toEqual(expect.any(Boolean));
  expect(product.co2_rating).toEqual(expect.any(String));
  expect(product.co2_rating.length).toBeGreaterThan(0);
  expect(product.in_stock).toEqual(expect.any(Boolean));
  expect(product.is_eco_friendly).toEqual(expect.any(Boolean));
  expect(product.product_image).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      by_name: expect.any(String),
      by_url: expect.any(String),
      source_name: expect.any(String),
      source_url: expect.any(String),
      file_name: expect.any(String),
      title: expect.any(String),
    }),
  );
  expect(product.product_image.id.length).toBeGreaterThan(0);
  expect(product.product_image.file_name.length).toBeGreaterThan(0);
  expect(product.category).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String),
      slug: expect.any(String),
    }),
  );
  expect(product.category.id.length).toBeGreaterThan(0);
  expect(product.category.name.length).toBeGreaterThan(0);
  expect(product.category.slug.length).toBeGreaterThan(0);
  expect(product.brand).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String),
    }),
  );
  expect(product.brand.id.length).toBeGreaterThan(0);
  expect(product.brand.name.length).toBeGreaterThan(0);
}
