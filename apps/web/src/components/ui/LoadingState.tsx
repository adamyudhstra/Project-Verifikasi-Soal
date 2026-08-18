import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-gray-500">
      <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
      <p>Loading data...</p>
    </div>
  );
};
