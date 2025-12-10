import { ReactNode } from 'react';

interface TableProps<T> {
  headers: string[];
  data: T[][];
  loading?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  render?: (item: T) => ReactNode;
  rowCount?: number;
  colCount?: number;
}

const DEFAULT_HEADER_CLASS =
  'px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';

const DEFAULT_CELL_CLASS = "px-3 md:px-6 py-4 text-sm text-gray-900"

export default function TableFrom2D<T>({
  headers,
  data,
  loading = false,
  headerClassName = DEFAULT_HEADER_CLASS,
  cellClassName = DEFAULT_CELL_CLASS,
  render = (item) => item as unknown as ReactNode,
  rowCount,
  colCount,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className={headerClassName}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-3 md:px-6 py-4 text-center text-gray-500 text-sm"
              >
                Loading...
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cellClassName || DEFAULT_CELL_CLASS}
                  >
                    {render(cell)}
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
