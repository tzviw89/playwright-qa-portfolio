import { expect, test } from '@playwright/test';
import { sampleBooking, type CreatedBooking } from '../../src/restful-booker/booking';
import {
  createBooking,
  createToken,
  deleteBooking,
  getBooking,
  updateBooking,
} from '../../src/restful-booker/client';

test.describe('booking lifecycle', () => {
  test('creates a booking and reads it back', async ({ request }) => {
    const booking = sampleBooking({ firstname: 'Grace', lastname: 'Hopper' });

    const createResponse = await createBooking(request, booking);
    expect(createResponse.status()).toBe(200);

    const created = (await createResponse.json()) as CreatedBooking;
    expect(created.bookingid).toEqual(expect.any(Number));
    expect(created.booking).toEqual(booking);

    const getResponse = await getBooking(request, created.bookingid);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toEqual(booking);
  });

  test('auth token allows updating a booking', async ({ request }) => {
    const original = sampleBooking({ firstname: 'Alan', lastname: 'Turing' });
    const createResponse = await createBooking(request, original);
    expect(createResponse.status()).toBe(200);
    const { bookingid } = (await createResponse.json()) as CreatedBooking;

    const tokenResponse = await createToken(request);
    expect(tokenResponse.status()).toBe(200);
    const { token } = (await tokenResponse.json()) as { token: string };
    expect(token).toMatch(/\S+/);

    const updated = sampleBooking({
      firstname: 'Alan',
      lastname: 'Turing',
      totalprice: 220,
      depositpaid: false,
      additionalneeds: 'Late checkout',
      bookingdates: { checkin: '2026-07-10', checkout: '2026-07-14' },
    });

    const updateResponse = await updateBooking(request, bookingid, updated, token);
    expect(updateResponse.status()).toBe(200);
    expect(await updateResponse.json()).toEqual(updated);

    const getResponse = await getBooking(request, bookingid);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toEqual(updated);
  });

  test('auth token allows deleting a booking', async ({ request }) => {
    const booking = sampleBooking({ firstname: 'Katherine', lastname: 'Johnson' });
    const createResponse = await createBooking(request, booking);
    expect(createResponse.status()).toBe(200);
    const { bookingid } = (await createResponse.json()) as CreatedBooking;

    const tokenResponse = await createToken(request);
    expect(tokenResponse.status()).toBe(200);
    const { token } = (await tokenResponse.json()) as { token: string };

    const deleteResponse = await deleteBooking(request, bookingid, token);
    // Restful Booker returns 201 Created on a successful delete.
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await getBooking(request, bookingid);
    expect(getResponse.status()).toBe(404);
  });

  test('update without a token is rejected', async ({ request }) => {
    const booking = sampleBooking({ firstname: 'Margaret', lastname: 'Hamilton' });
    const createResponse = await createBooking(request, booking);
    expect(createResponse.status()).toBe(200);
    const { bookingid } = (await createResponse.json()) as CreatedBooking;

    const attempted = sampleBooking({
      firstname: 'Margaret',
      lastname: 'Hamilton',
      totalprice: 999,
    });

    const updateResponse = await updateBooking(request, bookingid, attempted);
    expect(updateResponse.status()).toBe(403);
    expect(await updateResponse.text()).toBe('Forbidden');

    const getResponse = await getBooking(request, bookingid);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toEqual(booking);
  });
});
