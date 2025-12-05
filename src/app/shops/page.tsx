'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ShopResponse } from '@/lib/type';
import { useShops } from '@/lib/hooks';
import Pagination from '@/components/Pagination';
import Table, { Column } from '@/components/Table';
import { DEFAULT_PAGE_SIZE, AccountPeriodTypeLabels } from '@/constants';

export default function ShopsPage() {
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const [limit] = useState(DEFAULT_PAGE_SIZE);
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

  const headers = useMemo(
    () => ['ID', 'Name', 'Period Type', 'Cumulative', 'Created At', 'Actions'],
    []
  );

  const columns: Column<ShopResponse>[] = useMemo(
    () => [
      {
        key: 'id',
        render: (shop) => <span className="whitespace-nowrap">{shop.id}</span>,
      },
      {
        key: 'name',
        render: (shop) => <span className="whitespace-nowrap">{shop.name}</span>,
      },
      {
        key: 'period_type',
        render: (shop) => <span className="whitespace-nowrap">{AccountPeriodTypeLabels[shop.period_type]}</span>,
      },
      {
        key: 'is_cumulative',
        render: (shop) => (
          <span className="whitespace-nowrap">
            {shop.is_cumulative ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        key: 'created_at',
        render: (shop) => (
          <span className="whitespace-nowrap">
            {new Date(shop.created_at).toLocaleDateString()}
          </span>
        ),
      },
      {
        key: '',
        render: (shop) => (
          <button
            className="text-blue-600 hover:underline"
            onClick={() => {
              router.push(`/shops/${shop.id}`);
            }}
          >
            detail
          </button>
        ),
      },
    ],
    [router]
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
          headers={headers}
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
