import { useState, useEffect } from 'react';
import { Search, Filter, Eye, ChevronDown, Clock, MapPin, Radio, Brain, ArrowRight, FileText } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { getAlerts, acknowledgeAlert } from '../services/alertService';
import { useOutletContext } from 'react-router-dom';

const severityOptions = ['all', 'critical', 'warning', 'safe'];
const statusOptions = ['all', 'active', 'acknowledged', 'resolved'];
const sourceOptions = ['all', 'sensor', 'vision', 'fusion'];

export default function Alerts() {
  const { selectedSite } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({ severity: 'all', status: 'all', source: 'all', search: '' });
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [error, setError] = useState('');

  async function loadAlerts() {
    setLoading(true);
    setError('');
    try {
      const data = await getAlerts({ ...filters, siteId: selectedSite });
      setAlerts(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAlerts(); }, [filters.severity, filters.status, filters.source, selectedSite]);

  const filtered = alerts.filter(a => {
    if (filters.search && !a.title.toLowerCase().includes(filters.search.toLowerCase()) && !a.source.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  function timeAgo(iso) {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  }

  async function handleAcknowledge(id) {
    try {
      await acknowledgeAlert(id);
      await loadAlerts();
      if (selectedAlert?.id === id) setSelectedAlert(prev => ({ ...prev, status: 'acknowledged' }));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text">Alerts</h1>
        <p className="text-text-muted text-sm mt-1">Safety alert triage and management from the connected backend</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
        {[
          { label: 'Active', count: alerts.filter(a => a.status === 'active').length, color: 'bg-critical-bg text-critical' },
          { label: 'Acknowledged', count: alerts.filter(a => a.status === 'acknowledged').length, color: 'bg-warning-bg text-warning' },
          { label: 'Resolved', count: alerts.filter(a => a.status === 'resolved').length, color: 'bg-safe-bg text-safe' },
          { label: 'Total', count: alerts.length, color: 'bg-primary-light text-primary' },
        ].map(s => (
          <div key={s.label} className="bg-surface rounded-xl border border-border p-4">
            <p className={`text-2xl font-bold ${s.color.split(' ')[1]}`}>{s.count}</p>
            <p className="text-sm text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4 flex flex-wrap items-center gap-3 animate-fade-in-up">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-surface-alt border border-border rounded-lg text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        {[
          { key: 'severity', options: severityOptions, label: 'Severity' },
          { key: 'status', options: statusOptions, label: 'Status' },
          { key: 'source', options: sourceOptions, label: 'Source' },
        ].map(f => (
          <select
            key={f.key}
            value={filters[f.key]}
            onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
            className="px-3 py-2 bg-surface-alt border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 capitalize"
            aria-label={`Filter by ${f.label}`}
          >
            {f.options.map(o => (
              <option key={o} value={o} className="capitalize">{o === 'all' ? `All ${f.label}` : o}</option>
            ))}
          </select>
        ))}
      </div>

      {/* Alert List */}
      {error ? <ErrorState message={error} onRetry={loadAlerts} /> : loading ? <LoadingState /> : filtered.length === 0 ? (
        <EmptyState title="No alerts match your filters" message="Try adjusting your filter criteria." />
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-alt">
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">Severity</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">Alert</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider hidden md:table-cell">Source</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider hidden lg:table-cell">Zone</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">Time</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filtered.map(alert => (
                  <tr key={alert.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-5 py-3.5"><StatusBadge status={alert.severity} size="sm" /></td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-text">{alert.title}</p>
                      <p className="text-xs text-text-muted md:hidden">{alert.source}</p>
                    </td>
                    <td className="px-5 py-3.5 text-text-secondary hidden md:table-cell">{alert.source}</td>
                    <td className="px-5 py-3.5 text-text-secondary hidden lg:table-cell">{alert.zone.split('—')[0].trim()}</td>
                    <td className="px-5 py-3.5 text-text-muted">{timeAgo(alert.timestamp)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                        alert.status === 'active' ? 'bg-critical-bg text-critical' :
                        alert.status === 'acknowledged' ? 'bg-warning-bg text-warning' :
                        'bg-safe-bg text-safe'
                      }`}>{alert.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="flex items-center gap-1 text-primary hover:text-primary-hover font-medium text-sm transition-colors"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alert Detail Modal */}
      <Modal isOpen={!!selectedAlert} onClose={() => setSelectedAlert(null)} title="Alert Details" size="lg">
        {selectedAlert && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-text">{selectedAlert.title}</h3>
                <p className="text-sm text-text-muted mt-1">{selectedAlert.id}</p>
              </div>
              <StatusBadge status={selectedAlert.severity} size="lg" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-surface-alt rounded-lg">
                <p className="text-xs text-text-muted font-medium mb-1">Source</p>
                <p className="text-sm font-medium text-text flex items-center gap-1.5"><Radio className="w-4 h-4" />{selectedAlert.source}</p>
              </div>
              <div className="p-3 bg-surface-alt rounded-lg">
                <p className="text-xs text-text-muted font-medium mb-1">Zone</p>
                <p className="text-sm font-medium text-text flex items-center gap-1.5"><MapPin className="w-4 h-4" />{selectedAlert.zone}</p>
              </div>
              <div className="p-3 bg-surface-alt rounded-lg">
                <p className="text-xs text-text-muted font-medium mb-1">Detected</p>
                <p className="text-sm font-medium text-text flex items-center gap-1.5"><Clock className="w-4 h-4" />{new Date(selectedAlert.timestamp).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-surface-alt rounded-lg">
                <p className="text-xs text-text-muted font-medium mb-1">Status</p>
                <p className={`text-sm font-medium capitalize ${
                  selectedAlert.status === 'active' ? 'text-critical' : selectedAlert.status === 'acknowledged' ? 'text-warning' : 'text-safe'
                }`}>{selectedAlert.status}</p>
              </div>
            </div>

            {/* Sensor Context */}
            {selectedAlert.sensorContext && (
              <div className="p-4 bg-surface-alt rounded-lg border border-border">
                <h4 className="text-sm font-semibold text-text mb-2">Sensor Context</h4>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-text-secondary capitalize">{selectedAlert.sensorContext.type}:</span>
                  <span className="font-bold text-text">{selectedAlert.sensorContext.value} {selectedAlert.sensorContext.unit}</span>
                  <span className="text-text-muted">Threshold: {selectedAlert.sensorContext.threshold} {selectedAlert.sensorContext.unit}</span>
                </div>
              </div>
            )}

            {/* CV Context */}
            {selectedAlert.cvContext && (
              <div className="p-4 bg-surface-alt rounded-lg border border-border">
                <h4 className="text-sm font-semibold text-text mb-2">Computer Vision Event</h4>
                <p className="text-sm text-text-secondary">{selectedAlert.cvContext.event}</p>
                <p className="text-xs text-text-muted mt-1">Confidence: {(selectedAlert.cvContext.confidence * 100).toFixed(0)}% · Camera: {selectedAlert.cvContext.cameraId}</p>
                <div className="mt-3 p-6 border-2 border-dashed border-border rounded-lg text-center text-text-muted text-sm">
                  Evidence image placeholder — Available after CV pipeline integration
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className="p-4 bg-primary-light rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold text-primary">Recommended Action</h4>
              </div>
              <p className="text-sm text-text-secondary">{selectedAlert.recommendation}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              {selectedAlert.status === 'active' && (
                <button
                  onClick={() => handleAcknowledge(selectedAlert.id)}
                  className="px-4 py-2 bg-warning text-white font-medium rounded-lg hover:bg-amber-600 transition-colors text-sm"
                >
                  Acknowledge
                </button>
              )}
              <button
                className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors text-sm flex items-center gap-2"
              >
                <FileText className="w-4 h-4" /> Open Incident
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
