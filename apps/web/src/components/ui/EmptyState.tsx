import { FileX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export const EmptyState = ({ title = 'No Data Found', message = 'There are no records to display at this time.' }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-gray-500 bg-white rounded-lg border border-gray-200 border-dashed">
      <FileX className="h-12 w-12 mb-4 text-gray-300" />
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
};
