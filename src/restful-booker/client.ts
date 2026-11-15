import type { APIRequestContext, APIResponse } from '@playwright/test';
import { admin } from './accounts';
import type { Booking } from './booking';

export function createBooking(request: APIRequestContext, booking: Booking): Promise<APIResponse> {
  return request.post('/booking', { data: booking });
}

export function getBooking(request: APIRequestContext, id: number): Promise<APIResponse> {
  return request.get(`/booking/${id}`);
}

export function createToken(request: APIRequestContext): Promise<APIResponse> {
  return request.post('/auth', {
    data: {
      username: admin.username,
      password: admin.password,
    },
  });
}

function authCookie(token?: string): { Cookie: string } | undefined {
  return token ? { Cookie: `token=${token}` } : undefined;
}

export function updateBooking(
  request: APIRequestContext,
  id: number,
  booking: Booking,
  token?: string,
): Promise<APIResponse> {
  return request.put(`/booking/${id}`, {
    data: booking,
    headers: authCookie(token),
  });
}

export function patchBooking(
  request: APIRequestContext,
  id: number,
  booking: Partial<Booking>,
  token?: string,
): Promise<APIResponse> {
  return request.patch(`/booking/${id}`, {
    data: booking,
    headers: authCookie(token),
  });
}

export function deleteBooking(
  request: APIRequestContext,
  id: number,
  token?: string,
): Promise<APIResponse> {
  return request.delete(`/booking/${id}`, {
    headers: authCookie(token),
  });
}
