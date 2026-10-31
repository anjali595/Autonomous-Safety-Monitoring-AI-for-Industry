import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({ title, value, icon: Icon, trend, trendLabel, color = 'primary', delay = 0 }) {
  const colorMap = {
    primary: 'text-primary bg-primary-light',
    safe: 'text-safe bg-safe-bg',
    warning: 'text-warning bg-warning-bg',
    critical: 'text-critical bg-critical-bg',
    info: 'text-info bg-info-bg',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-critical' : trend === 'down' ? 'text-safe' : 'text-text-muted';

  return (
    <div
      className={`bg-surface rounded-xl border border-border p-5 hover:shadow-lg hover:border-border-light transition-all duration-300 animate-fade-in-up stagger-${delay}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {trendLabel && <span>{trendLabel}</span>}
          </div>
        )}
      </div>
      <div className="animate-count-up">
        <p className="text-3xl font-bold text-text tracking-tight">{value}</p>
      </div>
      <p className="text-sm text-text-muted mt-1 font-medium">{title}</p>
    </div>
  );
}
