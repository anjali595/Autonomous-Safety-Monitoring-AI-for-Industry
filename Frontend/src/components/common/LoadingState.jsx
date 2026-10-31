import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading safety data…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <p className="text-text-muted text-sm font-medium">{message}</p>
    </div>
  );
}
