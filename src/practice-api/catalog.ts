/**
 * Response types for the public Practice Software Testing catalog
 * (https://api.practicesoftwaretesting.com).
 *
 * A product row on GET /products does not include `specs`. GET /products/{id}
 * adds `specs` and the category `parent_id`. Brand `slug` is on GET /brands,
 * not on the brand nested under a product.
 */

export type ProductImage = {
  id: string;
  by_name: string;
  by_url: string;
  source_name: string;
  source_url: string;
  file_name: string;
  title: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
};

export type ProductBrand = {
  id: string;
  name: string;
};

export type ProductSummary = {
  id: string;
  name: string;
  description: string;
  price: number;
  is_location_offer: boolean;
  is_rental: boolean;
  co2_rating: string;
  in_stock: boolean;
  is_eco_friendly: boolean;
  product_image: ProductImage;
  category: ProductCategory;
  brand: ProductBrand;
};

export type ProductSpec = {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  spec_unit: string | null;
};

export type ProductDetail = ProductSummary & {
  specs: ProductSpec[];
};

export type ProductPage = {
  current_page: number;
  data: ProductSummary[];
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
};

/** Id that is not a catalog product. GET /products/{id} answers 404. */
export const unknownProductId = 'does-not-exist';
