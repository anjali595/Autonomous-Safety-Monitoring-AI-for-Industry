import { apiRequest } from './apiClient';

export async function ingestDemoSensorReadings(readings) {
  return apiRequest('/sensors/readings/demo', {
    method: 'POST',
    body: readings,
  });
}

export async function importDemoSensorFile(file, siteId) {
  const body = new FormData();
  body.append('file', file);
  body.append('siteId', siteId);
  return apiRequest('/sensors/readings/import', { method: 'POST', body });
}

export async function importModelFeatureFile(file, siteId) {
  const body = new FormData();
  body.append('file', file);
  body.append('siteId', siteId);
  return apiRequest('/ml/sensor-predictions/import', { method: 'POST', body });
}

export async function getModelPredictionHistory(siteId) {
  return apiRequest(`/ml/sensor-predictions/history?siteId=${encodeURIComponent(siteId)}`);
}

export async function predictVisionMedia(file, cameraId, zone, siteId) {
  const body = new FormData();
  const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
  body.append(mediaType, file);
  body.append('cameraId', cameraId);
  body.append('zone', zone);
  body.append('siteId', siteId);
  return apiRequest('/vision/predictions', { method: 'POST', body });
}

export async function createDemoVisionEvent(request) {
  return apiRequest('/vision/events', { method: 'POST', body: request });
}

export async function getMlStatus() {
  return apiRequest('/ml/status');
}
