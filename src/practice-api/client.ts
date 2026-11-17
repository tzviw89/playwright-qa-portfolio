import type { APIRequestContext, APIResponse } from '@playwright/test';

export type ProductListQuery = {
  page?: number;
  /** Case-insensitive product-name filter. */
  q?: string;
};

/**
 * GET helpers for the public catalog. Paths start with `/` because baseURL
 * is the API host with no path prefix. This suite does not send writes.
 */
export function listProducts(
  request: APIRequestContext,
  query: ProductListQuery = {},
): Promise<APIResponse> {
  const params: Record<string, string | number> = {};
  if (query.page !== undefined) params.page = query.page;
  if (query.q !== undefined) params.q = query.q;

  return request.get('/products', { params });
}

export function getProduct(request: APIRequestContext, id: string): Promise<APIResponse> {
  return request.get(`/products/${id}`);
}

export function listCategories(request: APIRequestContext): Promise<APIResponse> {
  return request.get('/categories');
}

export function listBrands(request: APIRequestContext): Promise<APIResponse> {
  return request.get('/brands');
}
