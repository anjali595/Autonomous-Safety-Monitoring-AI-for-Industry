import { apiRequest, queryString } from './apiClient';
import { getModelPredictionHistory } from './demoService';

export async function getAnalyticsData(siteId) {
  const [data, modelPredictions] = await Promise.all([
    apiRequest(`/analytics${queryString({ siteId })}`),
    getModelPredictionHistory(siteId),
  ]);
  const severityColors = { Critical: '#ef4444', Warning: '#f59e0b', Safe: '#10b981' };
  const resolutionColors = { Resolved: '#10b981', Assigned: '#3b82f6', Open: '#f59e0b' };
  return {
    ...data,
    modelPredictions,
    riskOverTime: data.riskOverTime.map(point => ({
      ...point,
      label: new Date(point.timestamp).toLocaleString(),
    })),
    alertsBySeverity: data.alertsBySeverity.map(point => ({
      ...point,
      fill: severityColors[point.name] || '#64748b',
    })),
    incidentsByCategory: data.incidentsByCategory.map(point => ({
      category: point.name,
      count: point.value,
    })),
    resolutionStatus: data.resolutionStatus.map(point => ({
      ...point,
      fill: resolutionColors[point.name] || '#64748b',
    })),
    kpis: {
      avgRiskScore: data.kpis.avgRiskScore,
      criticalIncidents: data.kpis.criticalIncidents,
      mostFrequentHazard: data.kpis.mostFrequentHazard || '—',
      highestRiskZone: data.kpis.highestRiskZone || '—',
      avgResolutionTime: data.kpis.avgResolutionTime || '—',
    },
  };
}

export async function getAnalyticsKPIs(siteId) {
  const { kpis } = await getAnalyticsData(siteId);
  return kpis;
}
