import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'No data found', message = '', action = null }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-surface-alt flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text mb-1">{title}</h3>
      {message && <p className="text-text-muted text-sm">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
