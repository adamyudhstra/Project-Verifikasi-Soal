import type { ReactNode } from 'react';

interface TableProps {
  columns: string[];
  children: ReactNode;
}

export const Table = ({ columns, children }: TableProps) => {
  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {children}
        </tbody>
      </table>
    </div>
  );
};

interface TableRowProps {
  children: ReactNode;
}

export const TableRow = ({ children }: TableRowProps) => {
  return <tr className="hover:bg-gray-50">{children}</tr>;
};

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export const TableCell = ({ children, className = '' }: TableCellProps) => {
  return (
    <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6 ${className}`}>
      {children}
    </td>
  );
};
