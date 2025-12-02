'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ShopResponse } from '@/lib/type';
import { useShops } from '@/lib/hooks';
import Pagination from '@/components/Pagination';
import Table, { Column } from '@/components/Table';
import { AccountPeriodTypeLabels } from '@/constants';

export default function ShopsPage() {
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const { getToken } = useAuth();
  const token = getToken();

  // Use TanStack Query hook for fetching shops
  const { data: response, isLoading, error } = useShops(token, offset, limit, !!token);

  const shops = response?.data || [];
  const hasMore = shops.length >= limit;

  const handlePrevPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setOffset(offset + limit);
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;

  const columns: Column<ShopResponse>[] = useMemo(
    () => [
      {
        key: 'id',
        header: 'ID',
        render: (shop) => <span className="whitespace-nowrap">{shop.id}</span>,
      },
      {
        key: 'name',
        header: 'Name',
        render: (shop) => <span className="whitespace-nowrap">{shop.name}</span>,
      },
      {
        key: 'period_type',
        header: 'Period Type',
        render: (shop) => <span className="whitespace-nowrap">{AccountPeriodTypeLabels[shop.period_type]}</span>,
      },
      {
        key: 'is_cumulative',
        header: 'Cumulative',
        render: (shop) => (
          <span className="whitespace-nowrap">
            {shop.is_cumulative ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        key: 'created_at',
        header: 'Created At',
        render: (shop) => (
          <span className="whitespace-nowrap">
            {new Date(shop.created_at).toLocaleDateString()}
          </span>
        ),
      },
      {
        key: '',
        header: 'Actions',
        render: (shop) => (
          <div className="flex space-x-4">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => {
                // Handle edit action
              }}
            >
              Edit
            </button>
            <button
              className="text-red-600 hover:underline"
              onClick={() => {
                // Handle delete action
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shops</h1>

      {error && (
        <div className="mb-4 md:mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          Error: {response?.error || 'Failed to fetch shops'}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table
          columns={columns}
          data={shops}
          loading={isLoading}
          emptyMessage="No shops available."
          getRowKey={(shop) => String(shop.id)}
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
