import { ReactNode, useState, useEffect } from 'react';

interface CellWithAmount {
  amount: number | null;
  [key: string]: any;
}

interface EditableTableProps<T extends CellWithAmount> {
  headers: string[];
  data: T[][];
  loading?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  inputClassName?: string;
  render?: (item: T) => ReactNode;
  rowCount?: number;
  colCount?: number;
  onChange?: (rowIndex: number, colIndex: number, value: T) => void;
  editable?: boolean;
}

const DEFAULT_HEADER_CLASS =
  'px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';

const DEFAULT_CELL_CLASS = "px-3 md:px-6 py-4 text-sm text-gray-900"

const DEFAULT_INPUT_CLASS = "w-full px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"

export default function EditableTableFrom2D<T extends CellWithAmount>({
  headers,
  data,
  loading = false,
  headerClassName = DEFAULT_HEADER_CLASS,
  cellClassName = DEFAULT_CELL_CLASS,
  inputClassName = DEFAULT_INPUT_CLASS,
  render = (item) => item.amount !== null ? item.amount.toLocaleString() : '-',
  rowCount,
  colCount,
  onChange,
  editable = true,
}: EditableTableProps<T>) {
  const [editableData, setEditableData] = useState<T[][]>(data);

  useEffect(() => {
    setEditableData(data);
  }, [data]);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    if (!editable || !onChange) return;

    // Parse the value as a number or null
    const numericValue = value.trim() === '' ? null : parseFloat(value.replace(/,/g, ''));
    
    // Create updated data with the new value
    const updatedData = editableData.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx === rowIndex && cIdx === colIndex) {
          // Update the amount property
          const parsedAmount = numericValue === null || isNaN(numericValue) ? null : numericValue;
          return { ...cell, amount: parsedAmount } as T;
        }
        return cell;
      })
    );

    setEditableData(updatedData);
    
    // Call the onChange callback with the updated value
    const updatedCell = updatedData[rowIndex][colIndex];
    onChange(rowIndex, colIndex, updatedCell);
  };

  const getCellValue = (cell: T): string => {
    // Extract the amount value from the cell
    if (cell.amount === null || cell.amount === undefined) {
      return '';
    }
    return String(cell.amount);
  };

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
            editableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cellClassName || DEFAULT_CELL_CLASS}
                  >
                    {editable ? (
                      <input
                        type="text"
                        value={getCellValue(cell)}
                        onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                        className={inputClassName}
                        placeholder="-"
                      />
                    ) : (
                      render(cell)
                    )}
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
