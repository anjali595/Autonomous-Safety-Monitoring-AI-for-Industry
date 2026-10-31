import { apiRequest, queryString } from './apiClient';

export async function getSensorReadings(siteId) {
  const [latest, definitions] = await Promise.all([
    apiRequest(`/sensors/latest${queryString({ siteId })}`),
    getSensorDefinitions(siteId),
  ]);
  return Object.fromEntries(definitions.map(({ type }) => {
    const reading = latest[type];
    return [type, reading || {
      current: '—',
      status: 'offline',
      online: false,
      lastUpdated: null,
      history: [],
    }];
  }));
}

export async function getSensorDefinitions(siteId) {
  return apiRequest(`/sensors/definitions${queryString({ siteId })}`);
}

export async function refreshSensorReadings(siteId) {
  return getSensorReadings(siteId);
}
