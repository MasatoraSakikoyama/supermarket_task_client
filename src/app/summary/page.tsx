'use client';

import { useState, useMemo } from 'react';
import { useGet } from '@/lib/hooks';
import Table, { Column } from '@/components/Table';
import Pagination from '@/components/Pagination';
import { DEFAULT_PAGE_SIZE } from '@/constants';

interface SummaryData {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export default function SummaryPage() {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(DEFAULT_PAGE_SIZE);

  // Use TanStack Query hook for fetching data
  const { data: response, isLoading, refetch } = useGet<SummaryData[]>('/api/summary', shouldFetch);

  // Memoize allData to prevent unnecessary recalculations
  const allData = useMemo(() => response?.data || [], [response?.data]);

  const fetchSummary = () => {
    setShouldFetch(true);
    setOffset(0); // Reset to first page when fetching new data
    refetch();
  };

  const handlePrevPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  const handleNextPage = () => {
    if (offset + limit < allData.length) {
      setOffset(offset + limit);
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;
  
  // Calculate paginated data from all data
  const paginatedData = useMemo(() => {
    return allData.slice(offset, offset + limit);
  }, [allData, offset, limit]);

  const hasMore = offset + limit < allData.length;

  const headers = useMemo(
    () => ['ID', 'Name', 'Quantity', 'Price'],
    []
  );

  const columns: Column<SummaryData>[] = useMemo(
    () => [
      {
        key: 'id',
        render: (item) => <span className="whitespace-nowrap">{item.id}</span>,
      },
      {
        key: 'name',
        render: (item) => <span className="whitespace-nowrap">{item.name}</span>,
      },
      {
        key: 'quantity',
        render: (item) => <span className="whitespace-nowrap">{item.quantity}</span>,
      },
      {
        key: 'price',
        render: (item) => <span className="whitespace-nowrap">${item.price.toFixed(2)}</span>,
      },
    ],
    []
  );

  return (
    <div className="py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Summary</h1>
      <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
        View and manage summary data. Connect to your Web API to display real data.
      </p>

      <div className="mb-4 md:mb-6">
        <button
          onClick={fetchSummary}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base w-full sm:w-auto"
        >
          {isLoading ? 'Loading...' : 'Fetch Summary Data'}
        </button>
      </div>

      {response?.error && (
        <div className="mb-4 md:mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          Error: {response.error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table
          headers={headers}
          columns={columns}
          data={paginatedData}
          loading={isLoading}
          emptyMessage='No data available. Click "Fetch Summary Data" to load data from the API.'
        />

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          hasMore={hasMore}
          loading={isLoading}
          onPrevious={handlePrevPage}
          onNext={handleNextPage}
        />
      </div>
    </div>
  );
}
