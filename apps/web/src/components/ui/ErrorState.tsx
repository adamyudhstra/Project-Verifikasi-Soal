import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message = 'An error occurred while fetching data.', onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-red-500 bg-red-50 rounded-lg border border-red-200">
      <AlertTriangle className="h-12 w-12 mb-4 opacity-80" />
      <p className="text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-white text-red-600 border border-red-300 rounded hover:bg-red-100 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
