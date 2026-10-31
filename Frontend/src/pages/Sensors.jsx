import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Wifi, WifiOff, Thermometer, Droplets, Wind, CloudFog, CheckCircle2, AlertTriangle, XOctagon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SensorCard from '../components/cards/SensorCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import StatusBadge from '../components/common/StatusBadge';
import { getSensorReadings, refreshSensorReadings, getSensorDefinitions } from '../services/sensorService';

const chartColors = {
  temperature: '#ef4444',
  humidity: '#3b82f6',
  gas: '#f59e0b',
  smoke: '#8b5cf6',
};

function CustomTooltip({ active, payload, label, sensorType }) {
  if (!active || !payload?.length) return null;
  const unit = sensorType === 'temperature' ? '°C' : sensorType === 'humidity' ? '%' : sensorType === 'gas' ? 'ppm' : '%';
  return (
    <div className="bg-surface-raised rounded-lg shadow-lg border border-border p-3 text-sm">
      <p className="font-medium text-text">{label}</p>
      <p style={{ color: chartColors[sensorType] }} className="font-bold">{payload[0].value?.toFixed(1)} {unit}</p>
    </div>
  );
}

export default function Sensors() {
  const { selectedSite } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [sensors, setSensors] = useState(null);
  const [definitions, setDefinitions] = useState([]);
  const [error, setError] = useState('');
  const [selectedSensor, setSelectedSensor] = useState('temperature');

  async function loadSensors() {
    setLoading(true);
    setError('');
    try {
      const sensorDefinitions = await getSensorDefinitions(selectedSite);
      const data = await getSensorReadings(selectedSite);
      setDefinitions(sensorDefinitions);
      setSensors(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSensors(); }, [selectedSite]);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(async () => {
      try {
        const newSensors = await refreshSensorReadings(selectedSite);
        setSensors({ ...newSensors });
        setError('');
      } catch (requestError) {
        setError(requestError.message);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [loading, selectedSite]);

  if (loading) return <LoadingState message="Loading sensor data…" />;
  if (error) return <ErrorState message={error} onRetry={loadSensors} />;

  const onlineCount = sensors ? Object.values(sensors).filter(s => s.online).length : 0;
  const totalCount = sensors ? Object.keys(sensors).length : 0;
  const hasWarning = sensors && Object.values(sensors).some(s => s.status === 'warning');
  const hasCritical = sensors && Object.values(sensors).some(s => s.status === 'critical');

  const selectedData = sensors ? sensors[selectedSensor] : null;
  const selectedDef = definitions.find(s => s.type === selectedSensor);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text">Sensor Monitoring</h1>
        <p className="text-text-muted text-sm mt-1">Environmental sensor status and history from the connected backend</p>
      </div>

      {/* Health Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up">
        <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-safe-bg">
            <Wifi className="w-5 h-5 text-safe" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">{onlineCount}/{totalCount}</p>
            <p className="text-sm text-text-muted">Sensors Online</p>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-4">
          <div className={`p-3 rounded-xl ${hasCritical ? 'bg-critical-bg' : hasWarning ? 'bg-warning-bg' : 'bg-safe-bg'}`}>
            {hasCritical ? <XOctagon className="w-5 h-5 text-critical" /> : hasWarning ? <AlertTriangle className="w-5 h-5 text-warning" /> : <CheckCircle2 className="w-5 h-5 text-safe" />}
          </div>
          <div>
            <StatusBadge status={hasCritical ? 'critical' : hasWarning ? 'warning' : 'safe'} />
            <p className="text-sm text-text-muted mt-0.5">Overall Health</p>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-light">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text">8s</p>
            <p className="text-sm text-text-muted">Refresh Interval</p>
          </div>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors && Object.entries(sensors).map(([type, data], i) => (
          <div
            key={type}
            className={`cursor-pointer rounded-xl transition-all duration-200 ${selectedSensor === type ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            onClick={() => setSelectedSensor(type)}
          >
            <SensorCard type={type} data={data} delay={i + 1} />
          </div>
        ))}
      </div>

      {/* Selected Sensor Detail Chart */}
      {selectedData && (
        <div className="bg-surface rounded-xl border border-border p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-text capitalize">{selectedSensor} — History</h3>
              <p className="text-sm text-text-muted">{selectedDef?.zone || ''} · Last 6 hours</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={selectedData.status} />
              <div className="text-right">
                <p className="text-2xl font-bold text-text">{typeof selectedData.current === 'number' ? selectedData.current.toFixed(1) : selectedData.current}<span className="text-sm font-normal text-text-muted ml-1">{selectedDef?.unit}</span></p>
              </div>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedData.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8891a5' }} tickLine={false} axisLine={{ stroke: '#eef0f4' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: '#8891a5' }} tickLine={false} axisLine={false} width={40} />
                <Tooltip content={<CustomTooltip sensorType={selectedSensor} />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chartColors[selectedSensor]}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Thresholds info */}
          {selectedDef && (
            <div className="mt-4 flex items-center gap-6 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-safe" />
                Safe: {selectedDef.thresholds.safe[0]}–{selectedDef.thresholds.safe[1]} {selectedDef.unit}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-warning" />
                Warning: {selectedDef.thresholds.warning[0]}–{selectedDef.thresholds.warning[1]} {selectedDef.unit}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-critical" />
                Critical: ≥{selectedDef.thresholds.critical[0]} {selectedDef.unit}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Activity(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>;
}
