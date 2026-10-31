import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-raised rounded-lg shadow-lg border border-border p-3 text-sm">
      <p className="font-medium text-text mb-1">{label}</p>
      <p className={`font-bold ${
        payload[0].value >= 65 ? 'text-critical' : payload[0].value >= 30 ? 'text-warning' : 'text-safe'
      }`}>
        Risk Score: {Math.round(payload[0].value)}
      </p>
    </div>
  );
}

export default function RiskTrendChart({ data }) {
  if (!data || data.length === 0) return null;
  const displayData = data.slice(-24);

  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-fade-in-up">
      <h3 className="text-base font-semibold text-text mb-4">Risk Score Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#8891a5' }}
              tickLine={false}
              axisLine={{ stroke: '#eef0f4' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#8891a5' }}
              tickLine={false}
              axisLine={false}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={65} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.5} />
            <ReferenceLine y={30} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.5} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b6cf2"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
        <span className="flex items-center gap-1"><span className="w-3 h-[2px] bg-critical inline-block" /> Critical (65+)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-[2px] bg-warning inline-block" /> Warning (30+)</span>
      </div>
    </div>
  );
}
