import { randomInt } from 'node:crypto';

export type PetStatus = 'available' | 'pending' | 'sold';

export type Pet = {
  id: number;
  category: { id: number; name: string };
  name: string;
  photoUrls: string[];
  tags: { id: number; name: string }[];
  status: PetStatus;
};

/**
 * Ids in this band stay inside Number.MAX_SAFE_INTEGER, so they survive a
 * JSON round-trip, and they sit above the small ids the shared demo rewrites
 * constantly. randomInt's span has to stay under 2^48.
 */
function uniquePetId(): number {
  return 1_000_000_000_000_000 + randomInt(2 ** 48 - 1);
}

/** Demo pet payload with a fresh id. Override fields as needed per test. */
export function samplePet(overrides: Partial<Pet> = {}): Pet {
  return {
    id: uniquePetId(),
    category: { id: 1, name: 'dogs' },
    name: 'Hound',
    photoUrls: ['https://example.com/hound.jpg'],
    tags: [{ id: 1, name: 'demo' }],
    status: 'available',
    ...overrides,
  };
}
