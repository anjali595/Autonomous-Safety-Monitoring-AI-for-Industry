import { Bell, ChevronDown, MapPin, Shield, Menu, Sun, Moon, LogOut } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { getAlerts } from '../../services/alertService';
import { createSite } from '../../services/siteService';
import { useState, useRef, useEffect } from 'react';

export default function Header({
  selectedSite, onSiteChange, sites, siteLoadError, onSiteCreated,
  systemState, currentUser, onMobileMenuToggle, darkMode, setDarkMode, onLogout,
}) {
  const [siteOpen, setSiteOpen] = useState(false);
  const [siteCreateOpen, setSiteCreateOpen] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [siteSaving, setSiteSaving] = useState(false);
  const [siteError, setSiteError] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationError, setNotificationError] = useState('');
  const siteRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (siteRef.current && !siteRef.current.contains(e.target)) setSiteOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    let active = true;
    async function refreshNotifications() {
      try {
        const data = await getAlerts({ status: 'active', siteId: selectedSite });
        if (active) {
          setNotifications(data.slice(0, 5));
          setNotificationError('');
        }
      } catch (error) {
        if (active) setNotificationError(error.message);
      }
    }

    refreshNotifications();
    const interval = setInterval(refreshNotifications, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [selectedSite]);

  const currentSite = sites.find(s => s.id === selectedSite) || sites[0] || { name: 'Select a site', location: '' };
  const stateMap = { SAFE: 'safe', WARNING: 'warning', CRITICAL: 'critical' };

  async function handleCreateSite(event) {
    event.preventDefault();
    setSiteSaving(true);
    setSiteError('');
    try {
      const site = await createSite(siteName, siteLocation);
      onSiteCreated(site);
      setSiteName('');
      setSiteLocation('');
      setSiteCreateOpen(false);
      setSiteOpen(false);
    } catch (error) {
      setSiteError(error.message);
    } finally {
      setSiteSaving(false);
    }
  }

  function timeAgo(timestamp) {
    if (!timestamp) return '';
    const minutes = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    return `${Math.floor(minutes / 60)} hours ago`;
  }

  return (
    <header className={`h-14 sm:h-16 border-b flex items-center justify-between px-4 sm:px-6 flex-shrink-0 sticky top-0 z-30 transition-colors duration-300 ${
      darkMode
        ? 'bg-[#0f1119] border-white/[0.06]'
        : 'bg-surface border-border'
    }`}>
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMobileMenuToggle}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            darkMode ? 'text-gray-400 hover:text-white hover:bg-white/[0.06]' : 'text-text-muted hover:text-text hover:bg-surface-alt'
          }`}
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Site Selector */}
        <div className="relative" ref={siteRef}>
          <button
            onClick={() => setSiteOpen(!siteOpen)}
            className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm ${
              darkMode ? 'hover:bg-white/[0.06]' : 'hover:bg-surface-alt'
            }`}
            aria-expanded={siteOpen}
            aria-haspopup="listbox"
          >
            <MapPin className="w-4 h-4 text-primary" />
            <span className={`font-medium hidden sm:inline ${darkMode ? 'text-white' : 'text-text'}`}>{currentSite.name}</span>
            <span className={`font-medium sm:hidden ${darkMode ? 'text-white' : 'text-text'}`}>
              {currentSite.name.split('—')[0].trim()}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${darkMode ? 'text-gray-500' : 'text-text-muted'} ${siteOpen ? 'rotate-180' : ''}`} />
          </button>
          {siteOpen && (
            <div className={`absolute top-full left-0 mt-1 w-64 rounded-xl shadow-xl border py-1 animate-fade-in-up z-50 ${
              darkMode ? 'bg-[#151821] border-white/[0.08]' : 'bg-surface border-border'
            }`}>
              {siteLoadError && (
                <p role="alert" className={`px-4 py-2 text-xs ${darkMode ? 'text-red-300' : 'text-critical'}`}>
                  Sites could not be loaded: {siteLoadError}
                </p>
              )}
              {sites.map(site => (
                <button
                  key={site.id}
                  onClick={() => { onSiteChange(site.id); setSiteOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    site.id === selectedSite
                      ? darkMode ? 'bg-primary/10 text-blue-400 font-medium' : 'bg-primary-light text-primary font-medium'
                      : darkMode ? 'text-gray-300 hover:bg-white/[0.04]' : 'text-text hover:bg-surface-alt'
                  }`}
                >
                  <p className="font-medium">{site.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-text-muted'}`}>{site.location}</p>
                </button>
              ))}
              <div className={`border-t px-3 py-2 ${darkMode ? 'border-white/[0.08]' : 'border-border'}`}>
                {siteCreateOpen ? (
                  <form onSubmit={handleCreateSite} className="space-y-2">
                    <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-text'}`}>
                      Site name
                      <input
                        autoFocus
                        required
                        maxLength={120}
                        value={siteName}
                        onChange={(event) => setSiteName(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-sm text-text outline-none focus:border-primary"
                        placeholder="e.g. North Warehouse"
                      />
                    </label>
                    <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-text'}`}>
                      Location (optional)
                      <input
                        maxLength={160}
                        value={siteLocation}
                        onChange={(event) => setSiteLocation(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-sm text-text outline-none focus:border-primary"
                        placeholder="Building or region"
                      />
                    </label>
                    {siteError && <p role="alert" className="text-xs text-critical">{siteError}</p>}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={siteSaving}
                        className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        {siteSaving ? 'Creating…' : 'Create site'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSiteCreateOpen(false); setSiteError(''); }}
                        className={`rounded-lg border border-border px-3 py-2 text-xs ${darkMode ? 'text-gray-300' : 'text-text'}`}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setSiteCreateOpen(true); setSiteError(''); }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${
                      darkMode ? 'text-blue-300 hover:bg-white/[0.04]' : 'text-primary hover:bg-surface-alt'
                    }`}
                  >
                    + Create a site
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* System Status */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg ${
          darkMode ? 'bg-white/[0.04]' : 'bg-surface-alt'
        }`}>
          <Shield className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-text-muted'}`} />
          <span className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-text-muted'}`}>System:</span>
          {stateMap[systemState]
            ? <StatusBadge status={stateMap[systemState]} size="sm" />
            : <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-text-muted'}`}>{systemState === 'UNAVAILABLE' ? 'Unavailable' : 'No assessment'}</span>}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? 'text-gray-400 hover:text-amber-400 hover:bg-white/[0.06]'
              : 'text-text-muted hover:text-amber-600 hover:bg-surface-alt'
          }`}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={darkMode}
        >
          {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className={`relative p-2 rounded-lg transition-colors ${
              darkMode ? 'text-gray-400 hover:text-white hover:bg-white/[0.06]' : 'text-text-muted hover:text-text hover:bg-surface-alt'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-critical rounded-full" />}
          </button>
          {notifOpen && (
            <div className={`absolute top-full right-0 mt-1 w-72 sm:w-80 rounded-xl shadow-xl border py-2 animate-fade-in-up z-50 ${
              darkMode ? 'bg-[#151821] border-white/[0.08]' : 'bg-surface border-border'
            }`}>
              <div className={`px-4 py-2 border-b ${darkMode ? 'border-white/[0.06]' : 'border-border'}`}>
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-text'}`}>Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notificationError ? (
                  <p role="alert" className={`px-4 py-3 text-sm ${darkMode ? 'text-red-300' : 'text-critical'}`}>{notificationError}</p>
                ) : notifications.length === 0 ? (
                  <p className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-400' : 'text-text-muted'}`}>No active alerts</p>
                ) : notifications.map((n, i) => (
                  <div key={i} className={`px-4 py-3 transition-colors ${darkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-surface-alt'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-text'}`}>{n.title}</p>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-text-muted'}`}>{n.zone} · {timeAgo(n.timestamp)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User + Logout */}
        {currentUser && (
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserOpen(!userOpen)}
              className={`flex items-center gap-2 pl-2 sm:pl-3 sm:border-l transition-colors ${
                darkMode ? 'border-white/[0.06]' : 'border-border'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <p className={`text-sm font-medium leading-tight ${darkMode ? 'text-white' : 'text-text'}`}>{currentUser.name}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-text-muted'}`}>{currentUser.role}</p>
              </div>
              <ChevronDown className={`w-3 h-3 hidden sm:block ${darkMode ? 'text-gray-500' : 'text-text-muted'}`} />
            </button>

            {userOpen && (
              <div className={`absolute top-full right-0 mt-1 w-48 rounded-xl shadow-xl border py-1 animate-fade-in-up z-50 ${
                darkMode ? 'bg-[#151821] border-white/[0.08]' : 'bg-surface border-border'
              }`}>
                <div className={`px-4 py-2.5 border-b ${darkMode ? 'border-white/[0.06]' : 'border-border'}`}>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-text'}`}>{currentUser.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-text-muted'}`}>{currentUser.email || currentUser.role}</p>
                </div>
                <button
                  onClick={() => { setUserOpen(false); if (onLogout) onLogout(); }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                    darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
