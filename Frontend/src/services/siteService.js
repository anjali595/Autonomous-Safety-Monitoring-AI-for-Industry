import { apiRequest } from './apiClient';

export async function getSites() {
  return apiRequest('/sites');
}

export async function createSite(name, location) {
  return apiRequest('/sites', {
    method: 'POST',
    body: { name, location: location.trim() || null },
  });
}
