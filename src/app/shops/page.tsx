'use client';

import { useState, useEffect, useMemo } from 'react';
import { getShops } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ShopResponse } from '@/lib/type';
import Pagination from '@/components/Pagination';
import Table, { Column } from '@/components/Table';

export default function ShopsPage() {
  const [shops, setShops] = useState<ShopResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const fetchShops = async () => {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        if (!cancelled) {
          setError('Not authenticated');
          setLoading(false);
        }
        return;
      }

      try {
        const response = await getShops(token, offset, limit);
        
        if (cancelled) return;

        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setShops(response.data);
          // If we received fewer items than the limit, there are no more pages
          setHasMore(response.data.length >= limit);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch shops');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchShops();

    return () => {
      cancelled = true;
    };
  }, [offset, limit, getToken]);

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
        key: 'description',
        header: 'Description',
        render: (shop) => shop.description || '-',
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
    ],
    []
  );

  return (
    <div className="py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shops</h1>
      <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
        View and manage shops with pagination.
      </p>

      {error && (
        <div className="mb-4 md:mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          Error: {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table
          columns={columns}
          data={shops}
          loading={loading}
          emptyMessage="No shops available."
          getRowKey={(shop) => String(shop.id)}
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
