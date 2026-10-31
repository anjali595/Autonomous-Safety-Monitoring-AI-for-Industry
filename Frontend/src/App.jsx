
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Sensors from './pages/Sensors';
import Alerts from './pages/Alerts';
import Incidents from './pages/Incidents';
import IncidentDetail from './pages/IncidentDetail';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import DemoLab from './pages/DemoLab';
import { users } from './data/mockData';
import { getRiskAssessment } from './services/riskService';
import { getSites } from './services/siteService';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedSite, setSelectedSite] = useState(() => localStorage.getItem('ig-selected-site') || 'plant-a');
  const [sites, setSites] = useState([]);
  const [siteLoadError, setSiteLoadError] = useState('');
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [systemState, setSystemState] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ig-darkMode') !== 'false');

  useEffect(() => {
    let active = true;
    getSites()
      .then((availableSites) => {
        if (!active) return;
        setSites(availableSites);
        setSiteLoadError('');
        if (!availableSites.some((site) => site.id === selectedSite)) {
          setSelectedSite(availableSites[0]?.id || '');
        }
      })
      .catch((error) => {
        if (active) setSiteLoadError(error.message);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (selectedSite) localStorage.setItem('ig-selected-site', selectedSite);
  }, [selectedSite]);

  useEffect(() => {
    localStorage.setItem('ig-darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  useEffect(() => {
    let active = true;
    async function refreshSystemState() {
      try {
        const risk = await getRiskAssessment(selectedSite);
        if (active) setSystemState(risk?.state || null);
      } catch {
        if (active) setSystemState('UNAVAILABLE');
      }
    }

    refreshSystemState();
    const interval = setInterval(refreshSystemState, 8000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [selectedSite]);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthenticated(false);
  };

  const handleSiteCreated = (site) => {
    setSites((current) => [...current.filter((item) => item.id !== site.id), site]
      .sort((left, right) => left.name.localeCompare(right.name)));
    setSelectedSite(site.id);
    setSiteLoadError('');
  };

  if (!authenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="*" element={<Home onLogin={handleLogin} darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <AppLayout
              selectedSite={selectedSite}
              onSiteChange={setSelectedSite}
              sites={sites}
              siteLoadError={siteLoadError}
              onSiteCreated={handleSiteCreated}
              systemState={systemState}
              currentUser={currentUser}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onLogout={handleLogout}
            />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/sensors" element={<Sensors />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/incidents/:id" element={<IncidentDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/demo" element={<DemoLab />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
