import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({
  selectedSite, onSiteChange, sites, siteLoadError, onSiteCreated,
  systemState, currentUser, darkMode, setDarkMode, onLogout,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`min-h-screen min-h-dvh transition-colors duration-300 ${darkMode ? 'bg-[#0b0d14]' : 'bg-surface-alt'}`}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          currentUser={currentUser}
          darkMode={darkMode}
        />
      </div>

      {/* Sidebar — mobile */}
      <div className={`lg:hidden fixed top-0 left-0 z-40 h-full transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar
          collapsed={false}
          onToggle={() => setMobileOpen(false)}
          currentUser={currentUser}
          darkMode={darkMode}
        />
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        }`}
      >
        <Header
          selectedSite={selectedSite}
          onSiteChange={onSiteChange}
          sites={sites}
          siteLoadError={siteLoadError}
          onSiteCreated={onSiteCreated}
          systemState={systemState}
          currentUser={currentUser}
          onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={onLogout}
        />
        <main className={`p-4 sm:p-6 max-w-[1600px] mx-auto transition-colors duration-300`}>
          <Outlet context={{ selectedSite, sites }} />
        </main>
      </div>
    </div>
  );
}
