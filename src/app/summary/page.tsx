'use client';

import { useState, useEffect, useMemo } from 'react';
import { get } from '@/lib/api';
import Table, { Column } from '@/components/Table';
import Pagination from '@/components/Pagination';

interface SummaryData {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export default function SummaryPage() {
  const [data, setData] = useState<SummaryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const fetchSummary = async (newOffset: number) => {
    setLoading(true);
    setError(null);
    
    // Example API call - replace with your actual API endpoint
    const response = await get<SummaryData[]>('/api/summary');
    
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      // Simulate pagination with mock data
      const allData = response.data;
      const paginatedData = allData.slice(newOffset, newOffset + limit);
      setData(paginatedData);
      setHasMore(newOffset + limit < allData.length);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    // Uncomment to fetch data on page load
    // fetchSummary(offset);
  }, [offset]);

  const handlePrevPage = () => {
    if (offset >= limit) {
      const newOffset = offset - limit;
      setOffset(newOffset);
      fetchSummary(newOffset);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      const newOffset = offset + limit;
      setOffset(newOffset);
      fetchSummary(newOffset);
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;

  const columns: Column<SummaryData>[] = useMemo(
    () => [
      {
        key: 'id',
        header: 'ID',
        render: (item) => <span className="whitespace-nowrap">{item.id}</span>,
      },
      {
        key: 'name',
        header: 'Name',
        render: (item) => <span className="whitespace-nowrap">{item.name}</span>,
      },
      {
        key: 'quantity',
        header: 'Quantity',
        render: (item) => <span className="whitespace-nowrap">{item.quantity}</span>,
      },
      {
        key: 'price',
        header: 'Price',
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
          onClick={() => fetchSummary(offset)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base w-full sm:w-auto"
        >
          {loading ? 'Loading...' : 'Fetch Summary Data'}
        </button>
      </div>

      {error && (
        <div className="mb-4 md:mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          Error: {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table
          columns={columns}
          data={data}
          loading={loading}
          emptyMessage='No data available. Click "Fetch Summary Data" to load data from the API.'
          getRowKey={(item) => String(item.id)}
        />

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          hasMore={hasMore}
          loading={loading}
          onPrevious={handlePrevPage}
          onNext={handleNextPage}
        />
      </div>
    </div>
  );
}
