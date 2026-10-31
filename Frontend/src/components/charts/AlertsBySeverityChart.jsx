import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-raised rounded-lg shadow-lg border border-border p-3 text-sm">
      <p className="font-medium" style={{ color: payload[0].payload.fill }}>
        {payload[0].name}: {payload[0].value}
      </p>
    </div>
  );
}

export default function AlertsBySeverityChart({ data }) {
  if (!data || data.length === 0) return null;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-fade-in-up">
      <h3 className="text-base font-semibold text-text mb-4">Alerts by Severity</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 mt-2">
        {data.map((entry, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
            <span className="text-text-secondary">{entry.name}</span>
            <span className="font-semibold text-text">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
