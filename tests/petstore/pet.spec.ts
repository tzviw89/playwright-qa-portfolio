import { createPet, deletePet, findPetsByStatus, getPet, updatePet } from '../../src/petstore/client';
import { samplePet, type Pet } from '../../src/petstore/pet';
import { expect, test } from '../../src/petstore/test';

test.describe('pet lifecycle', () => {
  test('creates a pet, reads it, updates it, finds it by status, and deletes it', async ({
    request,
    pets,
  }) => {
    const pet = samplePet();

    const createResponse = await createPet(request, pet);
    expect(createResponse.status()).toBe(200);
    pets.track(pet.id);
    expect(await createResponse.json()).toEqual(pet);

    const getResponse = await getPet(request, pet.id);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toEqual(pet);

    const updated: Pet = { ...pet, name: 'Terrier', status: 'pending' };
    const putResponse = await updatePet(request, updated);
    expect(putResponse.status()).toBe(200);
    expect(await putResponse.json()).toEqual(updated);

    const afterUpdate = await getPet(request, pet.id);
    expect(afterUpdate.status()).toBe(200);
    expect(await afterUpdate.json()).toEqual(updated);

    // The status list is shared. Only this pet is asserted.
    const findResponse = await findPetsByStatus(request, updated.status);
    expect(findResponse.status()).toBe(200);
    const found = (await findResponse.json()) as Pet[];
    expect(found).toEqual(expect.arrayContaining([updated]));

    const deleteResponse = await deletePet(request, pet.id);
    expect(deleteResponse.status()).toBe(200);
    const deleted = (await deleteResponse.json()) as { message?: string };
    expect(deleted.message).toBe(String(pet.id));

    const afterDelete = await getPet(request, pet.id);
    expect(afterDelete.status()).toBe(404);
    const missing = (await afterDelete.json()) as { message?: string };
    expect(missing.message).toBe('Pet not found');
  });
});
