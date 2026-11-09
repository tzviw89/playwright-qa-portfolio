export type BookingDates = {
  checkin: string;
  checkout: string;
};

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
};

export type CreatedBooking = {
  bookingid: number;
  booking: Booking;
};

/** Stable demo guest payload; override fields as needed per test. */
export function sampleBooking(overrides: Partial<Booking> = {}): Booking {
  const { bookingdates, ...rest } = overrides;

  return {
    firstname: 'Ada',
    lastname: 'Lovelace',
    totalprice: 150,
    depositpaid: true,
    additionalneeds: 'Breakfast',
    ...rest,
    bookingdates: {
      checkin: '2026-06-01',
      checkout: '2026-06-05',
      ...bookingdates,
    },
  };
}
