import { ReactNode } from 'react';


interface EditableTableProps<T> {
  headers: string[];
  data: T[][];
  getValue: (item: T) => ReactNode;
  onChange: (rowIndex: number, colIndex: number, value: T) => void;
  loading?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  inputClassName?: string;
}

const DEFAULT_HEADER_CLASS =
  'px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';

const DEFAULT_CELL_CLASS = "px-3 md:px-6 py-4 text-sm text-gray-900"

const DEFAULT_INPUT_CLASS = "w-full px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"

export default function EditableTableFrom2D<T>({
  headers,
  data,
  getValue,
  onChange,
  loading = false,
  headerClassName = DEFAULT_HEADER_CLASS,
  cellClassName = DEFAULT_CELL_CLASS,
  inputClassName = DEFAULT_INPUT_CLASS,
}: EditableTableProps<T>) {
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
                    className={cellClassName}
                  >
                    {
                      <input
                        type="text"
                        value={getValue(cell)}
                        onChange={(e) => onChange(rowIndex, cellIndex, e.target.value)}
                        className={inputClassName}
                      />
                    }
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
