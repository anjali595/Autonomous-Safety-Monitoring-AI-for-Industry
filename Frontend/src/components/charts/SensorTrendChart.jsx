import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';

const sensorColors = {
  temperature: '#ef4444',
  humidity: '#3b82f6',
  gas: '#f59e0b',
  smoke: '#8b5cf6',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-raised rounded-lg shadow-lg border border-border p-3 text-sm">
      <p className="font-medium text-text mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-text-secondary capitalize">{p.dataKey}: {p.value?.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}

export default function SensorTrendChart({ sensorReadings }) {
  const [visibleSensors, setVisibleSensors] = useState({
    temperature: true, humidity: true, gas: true, smoke: true
  });

  if (!sensorReadings) return null;

  // Merge all sensor histories by index
  const maxLen = Math.max(
    ...Object.values(sensorReadings).map(s => s.history?.length || 0)
  );
  const merged = [];
  for (let i = 0; i < Math.min(maxLen, 24); i++) {
    const idx = maxLen - 24 + i;
    if (idx < 0) continue;
    const point = { label: '' };
    for (const [type, data] of Object.entries(sensorReadings)) {
      if (data.history && data.history[idx]) {
        point.label = data.history[idx].label;
        point[type] = data.history[idx].value;
      }
    }
    merged.push(point);
  }

  const toggleSensor = (sensor) => {
    setVisibleSensors(prev => ({ ...prev, [sensor]: !prev[sensor] }));
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text">Sensor Trends</h3>
        <div className="flex items-center gap-2">
          {Object.keys(sensorColors).map(sensor => (
            <button
              key={sensor}
              onClick={() => toggleSensor(sensor)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                visibleSensors[sensor]
                  ? 'bg-surface-alt text-text'
                  : 'bg-transparent text-text-muted opacity-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sensorColors[sensor] }} />
              <span className="capitalize hidden sm:inline">{sensor}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={merged}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#8891a5' }}
              tickLine={false}
              axisLine={{ stroke: '#eef0f4' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#8891a5' }}
              tickLine={false}
              axisLine={false}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            {Object.entries(sensorColors).map(([sensor, color]) =>
              visibleSensors[sensor] ? (
                <Line
                  key={sensor}
                  type="monotone"
                  dataKey={sensor}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
