/**
 * Demo admin credentials published at
 * https://restful-booker.herokuapp.com/apidoc/index.html
 * Override with BOOKER_USERNAME / BOOKER_PASSWORD if needed.
 */
export const admin = {
  username: process.env.BOOKER_USERNAME ?? 'admin',
  password: process.env.BOOKER_PASSWORD ?? 'password123',
} as const;
