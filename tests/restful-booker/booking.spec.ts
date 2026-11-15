import { sampleBooking, type CreatedBooking } from '../../src/restful-booker/booking';
import {
  createBooking,
  createToken,
  deleteBooking,
  getBooking,
  patchBooking,
  updateBooking,
} from '../../src/restful-booker/client';
import { expect, test } from '../../src/restful-booker/test';

test.describe('booking lifecycle', () => {
  test('creates an auth token', async ({ request }) => {
    const tokenResponse = await createToken(request);

    expect(tokenResponse.status()).toBe(200);
    const body = (await tokenResponse.json()) as { token?: string };
    expect(body.token).toMatch(/\S+/);
  });

  test('creates a booking and reads it back', async ({ request, bookings }) => {
    const booking = sampleBooking({ firstname: 'Grace', lastname: 'Hopper' });

    const createResponse = await createBooking(request, booking);
    expect(createResponse.status()).toBe(200);

    const created = (await createResponse.json()) as CreatedBooking;
    expect(created.bookingid).toEqual(expect.any(Number));
    expect(created.booking).toEqual(booking);
    bookings.track(created.bookingid);

    const getResponse = await getBooking(request, created.bookingid);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toEqual(booking);
  });

  test('updates a booking with PUT and PATCH, then deletes it', async ({ request, bookings }) => {
    const original = sampleBooking({ firstname: 'Alan', lastname: 'Turing' });
    const createResponse = await createBooking(request, original);
    expect(createResponse.status()).toBe(200);
    const { bookingid } = (await createResponse.json()) as CreatedBooking;
    bookings.track(bookingid);

    const tokenResponse = await createToken(request);
    expect(tokenResponse.status()).toBe(200);
    const { token } = (await tokenResponse.json()) as { token: string };
    expect(token).toMatch(/\S+/);

    const replaced = sampleBooking({
      firstname: 'Alan',
      lastname: 'Turing',
      totalprice: 220,
      depositpaid: false,
      additionalneeds: 'Late checkout',
      bookingdates: { checkin: '2026-07-10', checkout: '2026-07-14' },
    });

    const putResponse = await updateBooking(request, bookingid, replaced, token);
    expect(putResponse.status()).toBe(200);
    expect(await putResponse.json()).toEqual(replaced);

    const patched = { ...replaced, additionalneeds: 'Quiet room' };
    const patchResponse = await patchBooking(
      request,
      bookingid,
      { additionalneeds: 'Quiet room' },
      token,
    );
    expect(patchResponse.status()).toBe(200);
    expect(await patchResponse.json()).toEqual(patched);

    const getResponse = await getBooking(request, bookingid);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toEqual(patched);

    // Restful Booker returns 201 Created on a successful delete, then 404 on read.
    const deleteResponse = await deleteBooking(request, bookingid, token);
    expect(deleteResponse.status()).toBe(201);
    expect(await deleteResponse.text()).toBe('Created');

    const afterDelete = await getBooking(request, bookingid);
    expect(afterDelete.status()).toBe(404);
    expect(await afterDelete.text()).toBe('Not Found');
  });

  test('delete without a token is rejected', async ({ request, bookings }) => {
    const booking = sampleBooking({ firstname: 'Margaret', lastname: 'Hamilton' });
    const createResponse = await createBooking(request, booking);
    expect(createResponse.status()).toBe(200);
    const { bookingid } = (await createResponse.json()) as CreatedBooking;
    bookings.track(bookingid);

    const deleteResponse = await deleteBooking(request, bookingid);
    expect(deleteResponse.status()).toBe(403);
    expect(await deleteResponse.text()).toBe('Forbidden');

    const getResponse = await getBooking(request, bookingid);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toEqual(booking);
  });
});
