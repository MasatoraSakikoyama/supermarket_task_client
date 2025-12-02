'use client';

import { useState, useEffect } from 'react';
import { getShops } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ShopResponse } from '@/lib/type';

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

      const response = await getShops(token, offset, limit);
      
      if (cancelled) return;

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setShops(response.data);
        // If we received fewer items than the limit, there are no more pages
        setHasMore(response.data.length === limit);
      }
      
      setLoading(false);
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-3 md:px-6 py-4 text-center text-gray-500 text-sm">
                    Loading...
                  </td>
                </tr>
              ) : shops.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 md:px-6 py-4 text-center text-gray-500 text-sm">
                    No shops available.
                  </td>
                </tr>
              ) : (
                shops.map((shop) => (
                  <tr key={shop.id}>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shop.id}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shop.name}
                    </td>
                    <td className="px-3 md:px-6 py-4 text-sm text-gray-900">
                      {shop.description || '-'}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(shop.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-center border-t border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={offset === 0 || loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!hasMore || loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
