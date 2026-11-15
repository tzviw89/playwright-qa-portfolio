import { test as base } from '@playwright/test';
import { createToken, deleteBooking } from './client';

type Bookings = {
  /** Remember an id this test created so teardown can delete it. */
  track: (bookingId: number) => void;
};

/**
 * Tracks booking ids a spec creates and deletes them after the test.
 * The public demo keeps bookings in memory and sometimes restarts, so a
 * cleanup delete that finds nothing (404 or 405) is treated as already gone.
 */
export const test = base.extend<{ bookings: Bookings }>({
  bookings: async ({ request }, use) => {
    const ids: number[] = [];

    await use({
      track(bookingId: number) {
        ids.push(bookingId);
      },
    });

    if (ids.length === 0) return;

    const tokenResponse = await createToken(request);
    if (tokenResponse.status() !== 200) return;

    const body = (await tokenResponse.json()) as { token?: string };
    if (!body.token) return;

    for (const id of ids) {
      const response = await deleteBooking(request, id, body.token);
      const status = response.status();
      if (status !== 201 && status !== 404 && status !== 405) {
        throw new Error(`cleanup delete for booking ${id} returned ${status}`);
      }
    }
  },
});

export { expect } from '@playwright/test';
