import { ShieldCheck, AlertTriangle, XOctagon, Info } from 'lucide-react';

const config = {
  safe: {
    icon: ShieldCheck,
    label: 'SAFE',
    className: 'bg-safe-bg text-safe border-safe-border',
    dotClass: 'bg-safe',
  },
  warning: {
    icon: AlertTriangle,
    label: 'WARNING',
    className: 'bg-warning-bg text-warning border-warning-border',
    dotClass: 'bg-warning',
  },
  critical: {
    icon: XOctagon,
    label: 'CRITICAL',
    className: 'bg-critical-bg text-critical border-critical-border',
    dotClass: 'bg-critical',
  },
  info: {
    icon: Info,
    label: 'INFO',
    className: 'bg-info-bg text-info border border-blue-200',
    dotClass: 'bg-info',
  },
};

export default function StatusBadge({ status, size = 'md', showIcon = true, showLabel = true, className = '' }) {
  const cfg = config[status] || config.safe;
  const Icon = cfg.icon;
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${cfg.className} ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={`Status: ${cfg.label}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      {showLabel && <span>{cfg.label}</span>}
    </span>
  );
}
