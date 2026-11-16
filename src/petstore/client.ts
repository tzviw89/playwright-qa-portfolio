import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Pet, PetStatus } from './pet';

// Paths stay relative to baseURL `.../v2/`. A leading slash drops that prefix.
export function createPet(request: APIRequestContext, pet: Pet): Promise<APIResponse> {
  return request.post('pet', { data: pet });
}

export function getPet(request: APIRequestContext, id: number): Promise<APIResponse> {
  return request.get(`pet/${id}`);
}

export function updatePet(request: APIRequestContext, pet: Pet): Promise<APIResponse> {
  return request.put('pet', { data: pet });
}

export function findPetsByStatus(
  request: APIRequestContext,
  status: PetStatus,
): Promise<APIResponse> {
  return request.get('pet/findByStatus', { params: { status } });
}

export function deletePet(request: APIRequestContext, id: number): Promise<APIResponse> {
  return request.delete(`pet/${id}`);
}
