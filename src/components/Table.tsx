import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
  cellClassName?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  getRowKey: (item: T) => string | number;
  headerClassName?: string;
}

const DEFAULT_HEADER_CLASS =
  'px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';

export default function Table<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available.',
  getRowKey,
  headerClassName = DEFAULT_HEADER_CLASS,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={column.className || headerClassName}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 md:px-6 py-4 text-center text-gray-500 text-sm"
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 md:px-6 py-4 text-center text-gray-500 text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={getRowKey(item)}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={column.cellClassName || "px-3 md:px-6 py-4 text-sm text-gray-900"}
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
