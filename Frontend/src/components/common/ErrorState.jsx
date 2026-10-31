import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message = 'Unable to load dashboard data', onRetry = null }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-critical-bg flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-critical" />
      </div>
      <h3 className="text-lg font-semibold text-text mb-1">Something went wrong</h3>
      <p className="text-text-muted text-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary-light rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
