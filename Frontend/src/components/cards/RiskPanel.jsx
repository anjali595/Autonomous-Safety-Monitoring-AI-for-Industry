import { ShieldCheck, AlertTriangle, XOctagon, Brain, Clock } from 'lucide-react';

const stateConfig = {
  SAFE: {
    icon: ShieldCheck,
    bgClass: 'bg-safe-bg border-safe-border',
    textClass: 'text-safe',
    pulseClass: 'animate-pulse-safe',
    label: 'SAFE',
    sublabel: 'No high-priority hazards detected',
  },
  WARNING: {
    icon: AlertTriangle,
    bgClass: 'bg-warning-bg border-warning-border',
    textClass: 'text-warning',
    pulseClass: 'animate-pulse-warning',
    label: 'WARNING',
    sublabel: 'Elevated readings require attention',
  },
  CRITICAL: {
    icon: XOctagon,
    bgClass: 'bg-critical-bg border-critical-border',
    textClass: 'text-critical',
    pulseClass: 'animate-pulse-critical',
    label: 'CRITICAL',
    sublabel: 'Multiple safety signals require immediate review',
  },
};

export default function RiskPanel({ riskData }) {
  if (!riskData) {
    return (
      <div className="rounded-xl border-2 border-border bg-surface-alt p-6 animate-fade-in-up">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Overall Risk Assessment</h3>
        <p className="text-sm text-text-muted">No assessment is available until sensor or vision data is received.</p>
      </div>
    );
  }
  const cfg = stateConfig[riskData.state] || stateConfig.SAFE;
  const Icon = cfg.icon;

  const scoreColor =
    riskData.score >= 65 ? 'text-critical' :
    riskData.score >= 30 ? 'text-warning' : 'text-safe';

  return (
    <div className={`rounded-xl border-2 p-6 ${cfg.bgClass} animate-fade-in-up`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-1">Overall Risk Assessment</h3>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${cfg.textClass.replace('text-', 'bg-')} ${cfg.pulseClass}`} />
            <span className={`text-lg font-bold ${cfg.textClass}`}>
              <Icon className="inline w-5 h-5 mr-1" />
              {cfg.label}
            </span>
          </div>
          <p className="text-sm text-text-muted mt-0.5">{cfg.sublabel}</p>
        </div>
        <div className="text-right">
          <p className={`text-5xl font-black tracking-tight ${scoreColor} animate-count-up`}>
            {riskData.score}
          </p>
          <p className="text-xs text-text-muted mt-1">Risk Score</p>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="bg-surface-raised rounded-lg p-4 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-text">Rule-Based Risk Analysis</span>
        </div>
        <p className="text-sm text-text-secondary mb-3">{riskData.explanation}</p>
        
        {riskData.contributing && riskData.contributing.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Contributing Signals</p>
            {riskData.contributing.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${
                  c.weight === 'high' ? 'bg-critical' : c.weight === 'medium' ? 'bg-warning' : 'bg-safe'
                }`} />
                <span className="text-text-secondary">{c.signal}</span>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                  c.weight === 'high' ? 'bg-critical-bg text-critical' :
                  c.weight === 'medium' ? 'bg-warning-bg text-warning' : 'bg-safe-bg text-safe'
                }`}>{c.weight}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 mt-3 text-xs text-text-muted">
          <Clock className="w-3 h-3" />
          <span>Last assessed: {new Date(riskData.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
