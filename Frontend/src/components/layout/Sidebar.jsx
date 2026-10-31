import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  Database,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/sensors', label: 'Sensors', icon: Activity },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { path: '/incidents', label: 'Incidents', icon: FileText },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/demo', label: 'Demo Lab', icon: Database },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle, currentUser, darkMode = true }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      } ${darkMode ? 'bg-nav' : 'bg-white border-r border-border'}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-14 sm:h-16 border-b flex-shrink-0 ${
        darkMode ? 'border-white/10' : 'border-border'
      }`}>
        <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
          <img src="/logo.png" alt="IndustrialGuard AI" className="w-9 h-9 object-contain" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <h1 className={`text-sm font-bold leading-tight tracking-tight font-display ${darkMode ? 'text-white' : 'text-text'}`}>IndustrialGuard</h1>
            <p className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">AI Platform</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-nav-hover'
                    : 'text-text-secondary hover:text-text hover:bg-surface-alt'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="animate-fade-in">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Area */}
      <div className={`px-3 pb-4 border-t pt-3 flex-shrink-0 ${darkMode ? 'border-white/10' : 'border-border'}`}>
        {currentUser && (
          <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            {!collapsed && (
              <div className="animate-fade-in overflow-hidden min-w-0">
                <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-text'}`}>{currentUser.name}</p>
                <p className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-text-muted'}`}>{currentUser.role}</p>
              </div>
            )}
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-center gap-2 mt-2 px-3 py-2 rounded-xl transition-colors text-sm ${
            darkMode ? 'text-gray-500 hover:text-white hover:bg-nav-hover' : 'text-text-muted hover:text-text hover:bg-surface-alt'
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
