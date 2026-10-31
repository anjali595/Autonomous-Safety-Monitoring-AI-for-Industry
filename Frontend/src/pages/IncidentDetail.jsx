import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import {
  ArrowLeft, Clock, MapPin, User, AlertTriangle, Plus, ArrowUpRight,
  CheckCircle2, MessageSquare, Shield, Radio, Camera, FileImage
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import Modal from '../components/common/Modal';
import { getIncidentById, updateIncidentStatus, assignIncident, addIncidentNote, escalateIncident } from '../services/incidentService';
import { users } from '../data/mockData';

const timelineIcons = {
  trigger: AlertTriangle,
  alert: AlertTriangle,
  created: Plus,
  assigned: User,
  note: MessageSquare,
  escalated: ArrowUpRight,
  resolved: CheckCircle2,
};

const timelineColors = {
  trigger: 'bg-critical text-white',
  alert: 'bg-warning text-white',
  created: 'bg-primary text-white',
  assigned: 'bg-info text-white',
  note: 'bg-gray-400 text-white',
  escalated: 'bg-critical text-white',
  resolved: 'bg-safe text-white',
};

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedSite } = useOutletContext();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [noteModal, setNoteModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');

  async function load() {
    setLoading(true);
    setError(false);
    setRequestError('');
    try {
      const data = await getIncidentById(id, selectedSite);
      if (!data) {
        setError(true);
        return;
      }
      setIncident(data);
    } catch (loadError) {
      setRequestError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id, selectedSite]);

  async function handleResolve() {
    await updateIncident(() => updateIncidentStatus(id, 'resolved'));
  }

  async function handleEscalate() {
    await updateIncident(() => escalateIncident(id));
  }

  async function handleAssign() {
    if (!selectedAssignee) return;
    const updated = await updateIncident(() => assignIncident(id, selectedAssignee));
    if (updated) {
      setAssignModal(false);
      setSelectedAssignee('');
    }
  }

  async function handleAddNote() {
    if (!noteText.trim()) return;
    const updated = await updateIncident(() => addIncidentNote(id, incident.assignedTo || 'Current User', noteText));
    if (updated) {
      setNoteModal(false);
      setNoteText('');
    }
  }

  async function updateIncident(action) {
    setRequestError('');
    try {
      const updated = await action();
      setIncident({ ...updated });
      return updated;
    } catch (actionError) {
      setRequestError(actionError.message);
      return null;
    }
  }

  if (loading) return <LoadingState message="Loading incident details…" />;
  if (requestError && !incident) return <ErrorState message={requestError} onRetry={load} />;
  if (error) return <ErrorState message={`Incident ${id} not found`} onRetry={load} />;
  if (!incident) return null;

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-start gap-4 animate-fade-in">
        <button
          onClick={() => navigate('/incidents')}
          className="p-2 rounded-lg hover:bg-surface-alt text-text-muted hover:text-text transition-colors mt-1"
          aria-label="Back to incidents"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-text">{incident.id}</h1>
            <StatusBadge status={incident.severity} />
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
              incident.status === 'open' ? 'bg-warning-bg text-warning' :
              incident.status === 'assigned' ? 'bg-info-bg text-info' :
              'bg-safe-bg text-safe'
            }`}>{incident.status}</span>
          </div>
          {requestError && <p role="alert" className="rounded-lg bg-critical-bg px-4 py-3 text-sm text-critical">{requestError}</p>}
          <p className="text-text-secondary mt-1">{incident.type} — {incident.zone}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content — 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-surface rounded-xl border border-border p-6 animate-fade-in-up">
            <h3 className="text-base font-semibold text-text mb-3">Description</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{incident.description}</p>
          </div>

          {/* Sensor Context */}
          {incident.sensorContext && (
            <div className="bg-surface rounded-xl border border-border p-6 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <Radio className="w-4 h-4 text-primary" />
                <h3 className="text-base font-semibold text-text">Sensor Context</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-surface-alt rounded-lg">
                  <p className="text-xs text-text-muted">Type</p>
                  <p className="text-sm font-medium text-text capitalize">{incident.sensorContext.type}</p>
                </div>
                <div className="p-3 bg-surface-alt rounded-lg">
                  <p className="text-xs text-text-muted">Peak Value</p>
                  <p className="text-sm font-bold text-critical">{incident.sensorContext.peakValue} {incident.sensorContext.unit}</p>
                </div>
                <div className="p-3 bg-surface-alt rounded-lg">
                  <p className="text-xs text-text-muted">Duration</p>
                  <p className="text-sm font-medium text-text">{incident.sensorContext.duration}</p>
                </div>
                <div className="p-3 bg-surface-alt rounded-lg">
                  <p className="text-xs text-text-muted">Source</p>
                  <p className="text-sm font-medium text-text capitalize">{incident.sensorContext.type} Sensor</p>
                </div>
              </div>
            </div>
          )}

          {/* Vision Context */}
          {incident.visionContext && (
            <div className="bg-surface rounded-xl border border-border p-6 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4 text-primary" />
                <h3 className="text-base font-semibold text-text">Vision Context</h3>
              </div>
              <p className="text-sm text-text-secondary mb-2">{incident.visionContext.event}</p>
              <p className="text-xs text-text-muted">Confidence: {(incident.visionContext.confidence * 100).toFixed(0)}%</p>
              <div className="mt-4 p-8 border-2 border-dashed border-border rounded-xl text-center">
                <FileImage className="w-8 h-8 text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-muted">Evidence image placeholder</p>
                <p className="text-xs text-text-muted mt-1">Available after CV pipeline integration</p>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-surface rounded-xl border border-border p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-text">Notes ({incident.notes?.length || 0})</h3>
              {incident.status !== 'resolved' && (
                <button
                  onClick={() => setNoteModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-alt text-text-secondary hover:text-text rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Note
                </button>
              )}
            </div>
            <div className="space-y-3">
              {(!incident.notes || incident.notes.length === 0) ? (
                <p className="text-sm text-text-muted">No notes yet.</p>
              ) : (
                incident.notes.map((note, i) => (
                  <div key={i} className="p-3 bg-surface-alt rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-text">{note.author}</span>
                      <span className="text-xs text-text-muted">{new Date(note.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{note.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar — 1 col */}
        <div className="space-y-6">
          {/* Meta info */}
          <div className="bg-surface rounded-xl border border-border p-5 space-y-4 animate-fade-in-up">
            <div>
              <p className="text-xs text-text-muted font-medium mb-1">Assignee</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {incident.assignedTo ? incident.assignedTo.split(' ').map(n => n[0]).join('') : '?'}
                  </span>
                </div>
                <span className="text-sm font-medium text-text">{incident.assignedTo || 'Unassigned'}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium mb-1">Zone</p>
              <p className="text-sm text-text flex items-center gap-1.5"><MapPin className="w-4 h-4 text-text-muted" />{incident.zone}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium mb-1">Created</p>
              <p className="text-sm text-text flex items-center gap-1.5"><Clock className="w-4 h-4 text-text-muted" />{new Date(incident.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium mb-1">Last Updated</p>
              <p className="text-sm text-text">{new Date(incident.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Actions */}
          {incident.status !== 'resolved' && (
            <div className="bg-surface rounded-xl border border-border p-5 space-y-3 animate-fade-in-up">
              <h3 className="text-sm font-semibold text-text mb-2">Actions</h3>
              <button
                onClick={() => setAssignModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
              >
                <User className="w-4 h-4" /> Assign
              </button>
              <button
                onClick={() => setNoteModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-alt text-text-secondary rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium border border-border"
              >
                <MessageSquare className="w-4 h-4" /> Add Note
              </button>
              <button
                onClick={handleEscalate}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-critical-bg text-critical rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-critical-border"
              >
                <ArrowUpRight className="w-4 h-4" /> Escalate
              </button>
              <button
                onClick={handleResolve}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-safe text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4" /> Resolve
              </button>
            </div>
          )}

          {incident.status === 'resolved' && (
            <div className="bg-safe-bg rounded-xl border border-safe-border p-5 text-center animate-fade-in-up">
              <CheckCircle2 className="w-8 h-8 text-safe mx-auto mb-2" />
              <p className="font-semibold text-safe">Resolved</p>
              <p className="text-xs text-text-muted mt-1">No further actions required</p>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-surface rounded-xl border border-border p-5 animate-fade-in-up">
            <h3 className="text-sm font-semibold text-text mb-4">Event Timeline</h3>
            <div className="space-y-0">
              {incident.timeline?.map((evt, i) => {
                const Icon = timelineIcons[evt.type] || Clock;
                const colorClass = timelineColors[evt.type] || 'bg-gray-300 text-white';
                return (
                  <div key={i} className="flex gap-3 relative">
                    {/* Line */}
                    {i < incident.timeline.length - 1 && (
                      <div className="absolute left-[13px] top-7 bottom-0 w-[2px] bg-border" />
                    )}
                    {/* Icon */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${colorClass}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {/* Content */}
                    <div className="pb-4 flex-1 min-w-0">
                      <p className="text-sm text-text font-medium">{evt.event}</p>
                      <p className="text-xs text-text-muted">{new Date(evt.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      <Modal isOpen={noteModal} onClose={() => setNoteModal(false)} title="Add Note" size="sm">
        <div className="space-y-4">
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Enter your note..."
            rows={4}
            className="w-full px-4 py-3 bg-surface-alt border border-border rounded-lg text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setNoteModal(false)} className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors">Cancel</button>
            <button onClick={handleAddNote} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">Add Note</button>
          </div>
        </div>
      </Modal>

      {/* Assign Modal */}
      <Modal isOpen={assignModal} onClose={() => setAssignModal(false)} title="Assign Incident" size="sm">
        <div className="space-y-4">
          <select
            value={selectedAssignee}
            onChange={e => setSelectedAssignee(e.target.value)}
            className="w-full px-4 py-3 bg-surface-alt border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Select assignee…</option>
            {users.map(u => (
              <option key={u.id} value={u.name}>{u.name} — {u.role}</option>
            ))}
          </select>
          <div className="flex justify-end gap-3">
            <button onClick={() => setAssignModal(false)} className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors">Cancel</button>
            <button onClick={handleAssign} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">Assign</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
