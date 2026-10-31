import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FileText, Search, Eye, AlertTriangle, CheckCircle2, Clock, UserCheck } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { getIncidents, getIncidentStats } from '../services/incidentService';

export default function Incidents() {
  const navigate = useNavigate();
  const { selectedSite } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({ open: 0, assigned: 0, critical: 0, resolvedToday: 0 });
  const [filter, setFilter] = useState({ status: 'all', severity: 'all', search: '' });
  const [error, setError] = useState('');

  async function loadIncidents() {
    setLoading(true);
    setError('');
    try {
      const data = await getIncidents({ siteId: selectedSite });
      setIncidents(data);
      setStats(getIncidentStats(data));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadIncidents(); }, [selectedSite]);

  const filtered = incidents.filter(inc => {
    if (filter.status !== 'all' && inc.status !== filter.status) return false;
    if (filter.severity !== 'all' && inc.severity !== filter.severity) return false;
    if (filter.search && !inc.id.toLowerCase().includes(filter.search.toLowerCase()) && !inc.type.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  function timeAgo(iso) {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  }

  if (loading) return <LoadingState message="Loading incidents…" />;
  if (error) return <ErrorState message={error} onRetry={loadIncidents} />;

  const statCards = [
    { label: 'Open', value: stats.open, icon: AlertTriangle, color: 'warning' },
    { label: 'Assigned', value: stats.assigned, icon: UserCheck, color: 'info' },
    { label: 'Critical', value: stats.critical, icon: AlertTriangle, color: 'critical' },
    { label: 'Resolved Today', value: stats.resolvedToday, icon: CheckCircle2, color: 'safe' },
  ];

  const colorMap = {
    warning: 'bg-warning-bg text-warning',
    info: 'bg-info-bg text-info',
    critical: 'bg-critical-bg text-critical',
    safe: 'bg-safe-bg text-safe',
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text">Incidents</h1>
        <p className="text-text-muted text-sm mt-1">Safety incident tracking and lifecycle management from the connected backend</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={s.label} className={`bg-surface rounded-xl border border-border p-4 animate-fade-in-up stagger-${i + 1}`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${colorMap[s.color]}`}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <p className={`text-3xl font-bold ${colorMap[s.color].split(' ')[1]}`}>{s.value}</p>
            <p className="text-sm text-text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4 flex flex-wrap items-center gap-3 animate-fade-in-up">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search incidents..."
            value={filter.search}
            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-surface-alt border border-border rounded-lg text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} className="px-3 py-2 bg-surface-alt border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30" aria-label="Filter by status">
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="assigned">Assigned</option>
          <option value="resolved">Resolved</option>
        </select>
        <select value={filter.severity} onChange={e => setFilter(f => ({ ...f, severity: e.target.value }))} className="px-3 py-2 bg-surface-alt border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30" aria-label="Filter by severity">
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
        </select>
      </div>

      {/* Incident Table */}
      {filtered.length === 0 ? (
        <EmptyState title="No incidents match your filters" icon={FileText} />
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-alt">
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">ID</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">Severity</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider hidden md:table-cell">Zone</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider hidden lg:table-cell">Created</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider hidden md:table-cell">Assigned</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filtered.map(inc => (
                  <tr key={inc.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-medium text-text">{inc.id}</td>
                    <td className="px-5 py-3.5 text-text-secondary">{inc.type}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={inc.severity} size="sm" /></td>
                    <td className="px-5 py-3.5 text-text-secondary hidden md:table-cell">{inc.zone.split('—')[0].trim()}</td>
                    <td className="px-5 py-3.5 text-text-muted hidden lg:table-cell">{timeAgo(inc.createdAt)}</td>
                    <td className="px-5 py-3.5 text-text-secondary hidden md:table-cell">{inc.assignedTo || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                        inc.status === 'open' ? 'bg-warning-bg text-warning' :
                        inc.status === 'assigned' ? 'bg-info-bg text-info' :
                        'bg-safe-bg text-safe'
                      }`}>{inc.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => navigate(`/incidents/${inc.id}`)}
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
    </div>
  );
}
