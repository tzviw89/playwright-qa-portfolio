import { test as base } from '@playwright/test';
import { deletePet } from './client';

type Pets = {
  /** Remember an id this test created so teardown can delete it. */
  track: (petId: number) => void;
};

/**
 * Tracks pet ids a spec creates and deletes them after the test.
 * The public demo is shared, so a cleanup delete that finds nothing (404)
 * is treated as already gone.
 */
export const test = base.extend<{ pets: Pets }>({
  pets: async ({ request }, use) => {
    const ids: number[] = [];

    await use({
      track(petId: number) {
        ids.push(petId);
      },
    });

    for (const id of ids) {
      const response = await deletePet(request, id);
      const status = response.status();
      if (status !== 200 && status !== 404) {
        throw new Error(`cleanup delete for pet ${id} returned ${status}`);
      }
    }
  },
});

export { expect } from '@playwright/test';
