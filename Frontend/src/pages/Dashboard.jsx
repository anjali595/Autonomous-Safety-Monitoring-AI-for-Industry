import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { AlertTriangle, ShieldAlert, Activity, FileText, Zap, Clock, Eye, ArrowRight } from 'lucide-react';
import KPICard from '../components/cards/KPICard';
import SensorCard from '../components/cards/SensorCard';
import RiskPanel from '../components/cards/RiskPanel';
import RiskTrendChart from '../components/charts/RiskTrendChart';
import SensorTrendChart from '../components/charts/SensorTrendChart';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { getSensorReadings, refreshSensorReadings } from '../services/sensorService';
import { getRiskAssessment, refreshRiskAssessment } from '../services/riskService';
import { getAlerts } from '../services/alertService';
import { getIncidents } from '../services/incidentService';
import { getModelPredictionHistory } from '../services/demoService';

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedSite, sites } = useOutletContext();
  const selectedSiteName = sites.find((site) => site.id === selectedSite)?.name || selectedSite;
  const [loading, setLoading] = useState(true);
  const [sensors, setSensors] = useState(null);
  const [risk, setRisk] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [modelPredictions, setModelPredictions] = useState([]);
  const [error, setError] = useState('');

  async function loadDashboard() {
    setLoading(true);
    setError('');
    try {
      const [s, r, a, i, predictions] = await Promise.all([
        getSensorReadings(selectedSite),
        getRiskAssessment(selectedSite),
        getAlerts({ siteId: selectedSite }),
        getIncidents({ siteId: selectedSite }),
        getModelPredictionHistory(selectedSite),
      ]);
      setSensors(s);
      setRisk(r);
      setAlerts(a);
      setIncidents(i);
      setModelPredictions(predictions);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDashboard(); }, [selectedSite]);

  // Auto-refresh sensors every 8 seconds
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(async () => {
      try {
        const newSensors = await refreshSensorReadings(selectedSite);
        setSensors({ ...newSensors });
        const newRisk = await refreshRiskAssessment(selectedSite);
        setRisk(newRisk);
        setError('');
      } catch (requestError) {
        setError(requestError.message);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [loading, selectedSite]);

  if (loading) return <LoadingState message="Loading safety dashboard…" />;
  if (error) return <ErrorState message={error} onRetry={loadDashboard} />;

  const activeAlerts = alerts.filter(a => a.status === 'active' || a.status === 'acknowledged').slice(0, 5);
  const recentIncidents = incidents.slice(0, 5);
  const sensorsOnline = sensors ? Object.values(sensors).filter(s => s.online).length : 0;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const criticalToday = alerts.filter(a =>
    a.severity === 'critical' && new Date(a.timestamp) >= startOfToday
  ).length;

  function timeAgo(iso) {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text">Safety Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">Site-specific safety monitoring · {selectedSiteName}</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard title="Overall Risk Score" value={risk ? risk.score : '—'} icon={ShieldAlert} color={risk?.score >= 65 ? 'critical' : risk?.score >= 30 ? 'warning' : 'safe'} trend={risk?.score >= 30 ? 'up' : 'down'} trendLabel={risk ? (risk.score >= 30 ? 'Elevated' : 'Low') : 'No data'} delay={1} />
        <KPICard title="Active Alerts" value={activeAlerts.length} icon={AlertTriangle} color={activeAlerts.length > 3 ? 'critical' : activeAlerts.length > 0 ? 'warning' : 'safe'} delay={2} />
        <KPICard title="Open Incidents" value={incidents.filter(i => i.status !== 'resolved').length} icon={FileText} color="primary" delay={3} />
        <KPICard title="Sensors Online" value={`${sensorsOnline}/4`} icon={Activity} color="safe" delay={4} />
        <KPICard title="Critical Alerts Today" value={criticalToday} icon={Zap} color={criticalToday > 0 ? 'critical' : 'safe'} delay={5} />
      </div>

      {/* Risk Panel + Sensor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskPanel riskData={risk} />
        <div className="grid grid-cols-2 gap-4">
          {sensors && Object.entries(sensors).map(([type, data], i) => (
            <SensorCard key={type} type={type} data={data} delay={i + 1} />
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskTrendChart data={risk?.history} />
        <SensorTrendChart sensorReadings={sensors} />
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-text">Trained sensor-model predictions</h3>
            <p className="mt-1 text-xs text-text-muted">Prediction history for the selected site</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/demo')}
            className="text-sm font-medium text-primary hover:text-primary-hover"
          >
            Add model data
          </button>
        </div>
        {modelPredictions.length === 0 ? (
          <p className="px-5 py-6 text-sm text-text-muted">No trained-model predictions have been uploaded for this site.</p>
        ) : (
          <div className="divide-y divide-border-light">
            {modelPredictions.slice(0, 3).map((prediction) => (
              <div key={prediction.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-text">{prediction.targetName || 'Sensor model'}: {prediction.prediction}</p>
                  <p className="text-xs text-text-muted">{new Date(prediction.predictedAt).toLocaleString()}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  prediction.prediction === '1' ? 'bg-critical-bg text-critical' : 'bg-safe-bg text-safe'
                }`}>
                  {prediction.prediction === '1' ? 'Positive prediction' : 'No fire alarm'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Alerts + Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <div className="bg-surface rounded-xl border border-border animate-fade-in-up">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-base font-semibold text-text">Active Alerts</h3>
            <button
              onClick={() => navigate('/alerts')}
              className="text-sm text-primary font-medium hover:text-primary-hover transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-border-light">
            {activeAlerts.length === 0 ? (
              <div className="px-5 py-8 text-center text-text-muted text-sm">No active alerts</div>
            ) : (
              activeAlerts.map(alert => (
                <button
                  key={alert.id}
                  onClick={() => navigate('/alerts')}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-surface-alt transition-colors text-left"
                >
                  <StatusBadge status={alert.severity} size="sm" showLabel={false} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{alert.title}</p>
                    <p className="text-xs text-text-muted">{alert.source} · {alert.zone.split('—')[0].trim()}</p>
                  </div>
                  <span className="text-xs text-text-muted flex-shrink-0">{timeAgo(alert.timestamp)}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-surface rounded-xl border border-border animate-fade-in-up">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-base font-semibold text-text">Recent Incidents</h3>
            <button
              onClick={() => navigate('/incidents')}
              className="text-sm text-primary font-medium hover:text-primary-hover transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-border-light">
            {recentIncidents.length === 0 ? (
              <div className="px-5 py-8 text-center text-text-muted text-sm">No incidents recorded</div>
            ) : (
              recentIncidents.map(incident => (
                <button
                  key={incident.id}
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-surface-alt transition-colors text-left"
                >
                  <StatusBadge status={incident.severity} size="sm" showLabel={false} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text">{incident.id} — {incident.type}</p>
                    <p className="text-xs text-text-muted">{incident.zone.split('—')[0].trim()} · {incident.assignedTo}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      incident.status === 'open' ? 'bg-warning-bg text-warning' :
                      incident.status === 'assigned' ? 'bg-info-bg text-info' :
                      'bg-safe-bg text-safe'
                    }`}>{incident.status}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
