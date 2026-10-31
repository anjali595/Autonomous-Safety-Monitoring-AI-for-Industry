import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-raised rounded-lg shadow-lg border border-border p-3 text-sm">
      <p className="font-medium text-text">{label}</p>
      <p className="text-primary font-bold">{payload[0].value} incidents</p>
    </div>
  );
}

export default function IncidentCategoryChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-fade-in-up">
      <h3 className="text-base font-semibold text-text mb-4">Incidents by Category</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#8891a5' }} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fontSize: 12, fill: '#4b5064' }}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#3b6cf2" radius={[0, 6, 6, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
