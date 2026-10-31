import { useState, useEffect } from 'react';
import { BarChart3, Target, Zap, MapPin, Clock, AlertTriangle } from 'lucide-react';
import KPICard from '../components/cards/KPICard';
import RiskTrendChart from '../components/charts/RiskTrendChart';
import AlertsBySeverityChart from '../components/charts/AlertsBySeverityChart';
import IncidentCategoryChart from '../components/charts/IncidentCategoryChart';
import HazardFrequencyChart from '../components/charts/HazardFrequencyChart';
import ResolutionStatusChart from '../components/charts/ResolutionStatusChart';
import ZoneHotspotChart from '../components/charts/ZoneHotspotChart';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { getAnalyticsData } from '../services/analyticsService';
import { useOutletContext } from 'react-router-dom';

export default function Analytics() {
  const { selectedSite, sites } = useOutletContext();
  const selectedSiteName = sites.find((site) => site.id === selectedSite)?.name || selectedSite;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  async function loadAnalytics() {
    setLoading(true);
    setError('');
    try {
      const d = await getAnalyticsData(selectedSite);
      setData(d);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAnalytics(); }, [selectedSite]);

  if (loading) return <LoadingState message="Loading analytics…" />;
  if (error) return <ErrorState message={error} onRetry={loadAnalytics} />;
  if (!data) return null;

  const { kpis } = data;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text">Safety Analytics</h1>
        <p className="text-text-muted text-sm mt-1">Historical patterns and trends · {selectedSiteName}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard title="Avg Risk Score" value={kpis.avgRiskScore ?? '—'} icon={Target} color="warning" delay={1} />
        <KPICard title="Critical Incidents" value={kpis.criticalIncidents} icon={Zap} color="critical" delay={2} />
        <KPICard title="Frequent Hazard" value={kpis.mostFrequentHazard} icon={AlertTriangle} color="warning" delay={3} />
        <KPICard title="Highest-Risk Zone" value={kpis.highestRiskZone} icon={MapPin} color="critical" delay={4} />
        <KPICard title="Avg Resolution" value={kpis.avgResolutionTime} icon={Clock} color="primary" delay={5} />
        <KPICard title="Model Predictions" value={data.modelPredictions.length} icon={BarChart3} color="primary" delay={6} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskTrendChart data={data.riskOverTime} />
        <AlertsBySeverityChart data={data.alertsBySeverity} />
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-text">Latest trained-model predictions</h2>
          <p className="mt-1 text-xs text-text-muted">Stored inputs and outputs for the selected site</p>
        </div>
        {data.modelPredictions.length === 0 ? (
          <p className="px-5 py-6 text-sm text-text-muted">No model predictions have been stored for this site.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-alt text-left text-xs uppercase text-text-muted">
                <tr>
                  <th className="px-5 py-3">Prediction</th>
                  <th className="px-5 py-3">Positive probability</th>
                  <th className="px-5 py-3">Input features</th>
                  <th className="px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {data.modelPredictions.slice(0, 10).map((prediction) => (
                  <tr key={prediction.id}>
                    <td className="px-5 py-3 font-medium text-text">{prediction.targetName}: {prediction.prediction}</td>
                    <td className="px-5 py-3 text-text-secondary">
                      {typeof prediction.probabilities['1'] === 'number'
                        ? `${(prediction.probabilities['1'] * 100).toFixed(1)}%`
                        : '—'}
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{Object.keys(prediction.features).length} feature values</td>
                    <td className="px-5 py-3 text-text-muted">{new Date(prediction.predictedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncidentCategoryChart data={data.incidentsByCategory} />
        <HazardFrequencyChart data={data.hazardFrequency} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResolutionStatusChart data={data.resolutionStatus} />
        <ZoneHotspotChart data={data.zoneHotspots} />
      </div>

      <div className="bg-surface-alt rounded-xl border border-border p-4 text-center animate-fade-in">
        <p className="text-xs text-text-muted">Analytics are based only on observations and events stored by the backend.</p>
      </div>
    </div>
  );
}
