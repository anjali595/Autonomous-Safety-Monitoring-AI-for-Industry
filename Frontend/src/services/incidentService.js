import { apiRequest, queryString } from './apiClient';

export async function getIncidents(filters = {}) {
  return apiRequest(`/incidents${queryString(filters)}`);
}

export async function getIncidentById(id, siteId) {
  try {
    return await apiRequest(`/incidents/${encodeURIComponent(id)}${queryString({ siteId })}`);
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export async function updateIncidentStatus(id, status) {
  return apiRequest(`/incidents/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: { status },
  });
}

export async function assignIncident(id, assignee) {
  return apiRequest(`/incidents/${encodeURIComponent(id)}/assign`, {
    method: 'PATCH',
    body: { assignedTo: assignee },
  });
}

export async function addIncidentNote(id, author, text) {
  return apiRequest(`/incidents/${encodeURIComponent(id)}/notes`, {
    method: 'POST',
    body: { author, text },
  });
}

export async function escalateIncident(id) {
  return apiRequest(`/incidents/${encodeURIComponent(id)}/escalate`, { method: 'PATCH' });
}

export function getIncidentStats(incidentList) {
  return {
    open: incidentList.filter(i => i.status === 'open').length,
    assigned: incidentList.filter(i => i.status === 'assigned').length,
    critical: incidentList.filter(i => i.severity === 'critical').length,
    resolvedToday: incidentList.filter(i => {
      if (i.status !== 'resolved') return false;
      const today = new Date().toDateString();
      return new Date(i.updatedAt).toDateString() === today;
    }).length,
  };
}
