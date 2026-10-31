import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const hazardColors = {
  gas: '#f59e0b',
  ppe: '#ef4444',
  temperature: '#3b82f6',
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
          <span className="text-text-secondary capitalize">{p.dataKey}: {p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function HazardFrequencyChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-fade-in-up">
      <h3 className="text-base font-semibold text-text mb-4">Hazard Frequency by Month</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#4b5064' }} tickLine={false} axisLine={{ stroke: '#eef0f4' }} />
            <YAxis tick={{ fontSize: 11, fill: '#8891a5' }} tickLine={false} axisLine={false} width={25} />
            <Tooltip content={<CustomTooltip />} />
            {Object.entries(hazardColors).map(([key, color]) => (
              <Bar key={key} dataKey={key} fill={color} radius={[3, 3, 0, 0]} barSize={12} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 mt-2">
        {Object.entries(hazardColors).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-text-secondary capitalize">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
