import { useState } from 'react';
import { User, Bell, Sliders, Palette, Save, Check } from 'lucide-react';
import { defaultSettings } from '../data/mockData';

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  const updateProfile = (key, value) => {
    setSettings(s => ({ ...s, profile: { ...s.profile, [key]: value } }));
  };

  const updateNotif = (key) => {
    setSettings(s => ({
      ...s,
      notifications: { ...s.notifications, [key]: !s.notifications[key] },
    }));
  };

  const updateThreshold = (sensor, level, value) => {
    setSettings(s => ({
      ...s,
      thresholds: {
        ...s.thresholds,
        [sensor]: { ...s.thresholds[sensor], [level]: parseFloat(value) || 0 },
      },
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ checked, onChange, label }) => (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-text-secondary group-hover:text-text transition-colors">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-300'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </label>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="text-text-muted text-sm mt-1">Application preferences — local state only</p>
      </div>

      {/* Profile */}
      <div className="bg-surface rounded-xl border border-border p-6 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-text">Profile</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Name</label>
            <input
              value={settings.profile.name}
              onChange={e => updateProfile('name', e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-alt border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
            <input
              value={settings.profile.email}
              onChange={e => updateProfile('email', e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-alt border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Role</label>
            <select
              value={settings.profile.role}
              onChange={e => updateProfile('role', e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-alt border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option>Safety Officer</option>
              <option>Shift Supervisor</option>
              <option>Plant Manager</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Site</label>
            <select
              value={settings.selectedSite}
              onChange={e => setSettings(s => ({ ...s, selectedSite: e.target.value }))}
              className="w-full px-4 py-2.5 bg-surface-alt border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="plant-a">Plant A — Main Manufacturing Floor</option>
              <option value="plant-b">Plant B — Assembly & Packaging</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-surface rounded-xl border border-border p-6 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-text">Notifications</h3>
        </div>
        <div className="space-y-4">
          <Toggle checked={settings.notifications.criticalAlerts} onChange={() => updateNotif('criticalAlerts')} label="Critical alerts" />
          <Toggle checked={settings.notifications.warningAlerts} onChange={() => updateNotif('warningAlerts')} label="Warning alerts" />
          <Toggle checked={settings.notifications.incidentUpdates} onChange={() => updateNotif('incidentUpdates')} label="Incident updates" />
          <Toggle checked={settings.notifications.dailyDigest} onChange={() => updateNotif('dailyDigest')} label="Daily safety digest" />
          <Toggle checked={settings.notifications.emailNotifications} onChange={() => updateNotif('emailNotifications')} label="Email notifications" />
          <Toggle checked={settings.notifications.soundAlerts} onChange={() => updateNotif('soundAlerts')} label="Sound alerts" />
        </div>
      </div>

      {/* Thresholds */}
      <div className="bg-surface rounded-xl border border-border p-6 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-5">
          <Sliders className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-text">Safety Thresholds</h3>
          <span className="text-xs bg-warning-bg text-warning px-2 py-0.5 rounded-full font-medium">Prototype</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(settings.thresholds).map(([sensor, levels]) => (
            <div key={sensor} className="p-4 bg-surface-alt rounded-lg">
              <h4 className="text-sm font-semibold text-text capitalize mb-3">{sensor}</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-text-muted mb-1">Warning</label>
                  <input
                    type="number"
                    value={levels.warning}
                    onChange={e => updateThreshold(sensor, 'warning', e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-warning/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Critical</label>
                  <input
                    type="number"
                    value={levels.critical}
                    onChange={e => updateThreshold(sensor, 'critical', e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-critical/30"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end animate-fade-in-up">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            saved
              ? 'bg-safe text-white'
              : 'bg-primary text-white hover:bg-primary-hover'
          }`}
        >
          {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
