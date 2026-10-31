import { apiRequest, queryString } from './apiClient';

export async function getAlerts(filters = {}) {
  return apiRequest(`/alerts${queryString(filters)}`);
}

export async function getAlertById(id) {
  try {
    return await apiRequest(`/alerts/${encodeURIComponent(id)}`);
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export async function acknowledgeAlert(id) {
  return apiRequest(`/alerts/${encodeURIComponent(id)}/acknowledge`, { method: 'PATCH' });
}

export async function resolveAlert(id) {
  return apiRequest(`/alerts/${encodeURIComponent(id)}/resolve`, { method: 'PATCH' });
}
