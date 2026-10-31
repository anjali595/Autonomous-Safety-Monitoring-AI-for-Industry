import { apiRequest, queryString } from './apiClient';

export async function getRiskAssessment(siteId) {
  try {
    return await apiRequest(`/risk/current${queryString({ siteId })}`);
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export async function refreshRiskAssessment(siteId) {
  return getRiskAssessment(siteId);
}
