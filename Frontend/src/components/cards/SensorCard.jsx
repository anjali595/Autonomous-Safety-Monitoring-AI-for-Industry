import { Thermometer, Droplets, Wind, CloudFog, Wifi, WifiOff } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const iconMap = {
  temperature: Thermometer,
  humidity: Droplets,
  gas: Wind,
  smoke: CloudFog,
};

const unitMap = {
  temperature: '°C',
  humidity: '%',
  gas: 'ppm',
  smoke: '%',
};

const colorMap = {
  safe: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
};

function timeAgo(isoString) {
  if (!isoString) return 'No readings yet';
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 10) return 'Just now';
  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  return `${Math.floor(diff / 3600)} hr ago`;
}

export default function SensorCard({ type, data, delay = 0 }) {
  const Icon = iconMap[type] || Wind;
  const unit = unitMap[type] || '';
  const sparkData = data.history ? data.history.slice(-20) : [];
  const lineColor = colorMap[data.status] || colorMap.safe;

  return (
    <div className={`bg-surface rounded-xl border border-border p-5 hover:shadow-lg transition-all duration-300 animate-fade-in-up stagger-${delay}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            data.status === 'critical' ? 'bg-critical-bg text-critical' :
            data.status === 'warning' ? 'bg-warning-bg text-warning' :
            'bg-safe-bg text-safe'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-text capitalize">{type}</h3>
            <StatusBadge status={data.status} size="sm" />
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-muted">
          {data.online ? (
            <><Wifi className="w-3.5 h-3.5 text-safe" /><span>Online</span></>
          ) : (
            <><WifiOff className="w-3.5 h-3.5 text-critical" /><span>Offline</span></>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-text tracking-tight">
            {typeof data.current === 'number' ? data.current.toFixed(1) : data.current}
            <span className="text-lg font-normal text-text-muted ml-1">{unit}</span>
          </p>
          <p className="text-xs text-text-muted mt-1">{timeAgo(data.lastUpdated)}</p>
          {data.dataSource === 'DEMO' && <p className="text-[10px] text-primary mt-1 font-medium">Demo input</p>}
        </div>

        {sparkData.length > 0 && (
          <div className="w-24 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
