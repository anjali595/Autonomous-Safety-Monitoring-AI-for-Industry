import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-raised rounded-lg shadow-lg border border-border p-3 text-sm">
      <p className="font-medium text-text">{label}</p>
      <p className="font-bold" style={{ color: '#3b6cf2' }}>Weighted risk signals: {payload[0].value}</p>
    </div>
  );
}

export default function ZoneHotspotChart({ data }) {
  if (!data || data.length === 0) return null;

  const coloredData = data.map(d => ({
    ...d,
    fill: d.risk >= 65 ? '#ef4444' : d.risk >= 30 ? '#f59e0b' : '#10b981',
  }));

  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-fade-in-up">
      <h3 className="text-base font-semibold text-text mb-4">Weighted Risk Signals by Zone</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={coloredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" vertical={false} />
            <XAxis
              dataKey="zone"
              tick={{ fontSize: 12, fill: '#4b5064' }}
              tickLine={false}
              axisLine={{ stroke: '#eef0f4' }}
            />
            <YAxis tick={{ fontSize: 11, fill: '#8891a5' }} tickLine={false} axisLine={false} width={35} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="risk" radius={[6, 6, 0, 0]} barSize={40}>
              {coloredData.map((entry, index) => (
                <rect key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
