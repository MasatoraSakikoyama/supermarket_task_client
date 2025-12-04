'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useShop, useShopAccountTitleList, useShopAccountEntryList } from '@/lib/hooks';
import { AccountPeriodTypeLabels, DEFAULT_PAGE_SIZE } from '@/constants';
import Pagination from '@/components/Pagination';

export default function ShopsDetailPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const token = getToken();
  const params = useParams<{ id: string }>();
  const shopId = params.id ? parseInt(params.id, 10) : 0;

  // Pagination state
  const [offset, setOffset] = useState(0);
  const [limit] = useState(DEFAULT_PAGE_SIZE);

  // Fetch data
  const { data: shopResponse, isLoading: isFetchingShop, error: fetchShopError } = useShop(
    token,
    shopId
  );

  const { data: shopAccountTitleResponse, isLoading: isFetchingShopAccountTitle, error: fetchShopAccountTitleError } = useShopAccountTitleList(
    token,
    shopId,
    0,
    100, // Get all account titles for headers
  );

  const { data: shopAccountEntryResponse, isLoading: isFetchingShopAccountEntry, error: fetchShopAccountEntryError } = useShopAccountEntryList(
    token,
    shopId,
    offset,
    limit,
  );


  if (!shopId) {
    return (
      <div className="py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shop - Detail</h1>
        <div className="mb-4 md:mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          Error: No shop ID provided
        </div>
      </div>
    );
  }

  if (isFetchingShop || isFetchingShopAccountTitle || isFetchingShopAccountEntry) {
    return (
      <div className="py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shop - Detail</h1>
        <div className="text-gray-600">Loading shop data...</div>
      </div>
    );
  }

  if (fetchShopError || !shopResponse?.data || fetchShopAccountTitleError || !shopAccountTitleResponse || fetchShopAccountEntryError || !shopAccountEntryResponse) {
    return (
      <div className="py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shop - Detail</h1>
        <div className="mb-4 md:mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          Error: {shopResponse?.error || 'Failed to fetch shop data'} {shopAccountTitleResponse?.error || 'Failed to fetch shop account title data'} {shopAccountEntryResponse?.error || 'Failed to fetch shop account entry data'}
        </div>
      </div>
    );
  }

  // Pagination handlers
  const handlePrevPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  const handleNextPage = () => {
    if (shopAccountEntryResponse.data && shopAccountEntryResponse.data.length >= limit) {
      setOffset(offset + limit);
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const hasMore = shopAccountEntryResponse.data ? shopAccountEntryResponse.data.length >= limit : false;

  return (
    <div className="py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shop - Detail</h1>

      <div className="w-full bg-white shadow rounded-lg p-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <div
            id="name"
            className="w-full px-3 py-2 text-gray-700 text-sm md:text-base"
          >
            {shopResponse.data.name}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="period_type" className="block text-sm font-medium text-gray-700">
            Period Type
          </label>
          <div
            id="period_type"
            className="w-full px-3 py-2 text-gray-700 text-sm md:text-base"
          >
            {AccountPeriodTypeLabels[shopResponse.data.period_type]}
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_cumulative"
              checked={shopResponse.data.is_cumulative}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled
            />
            <span className="text-sm font-medium text-gray-700">Is Cumulative</span>
          </label>
        </div>
      </div>

      <div className="w-full bg-white shadow rounded-lg p-4 mt-4">
        <div className="mb-4 md:mb-6">
          {/* Shop Account Titles Section */}
          <h2 className="text-xl font-semibold mb-4">Shop Account Entries</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  {shopAccountTitleResponse.data && shopAccountTitleResponse.data.map((accountTitle) => (
                    <th
                      key={accountTitle.id}
                      className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {accountTitle.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shopAccountEntryResponse.data && shopAccountEntryResponse.data.length > 0 ? (
                  // Group entries by year and month
                  (() => {
                    const grouped = new Map<string, Map<number, number>>();
                    shopAccountEntryResponse.data.forEach((entry) => {
                      const key = `${entry.year}-${entry.month}`;
                      if (!grouped.has(key)) {
                        grouped.set(key, new Map());
                      }
                      grouped.get(key)!.set(entry.shopp_account_title_id, entry.amount);
                    });

                    return Array.from(grouped.entries()).map(([key, amounts]) => {
                      const [year, month] = key.split('-');
                      return (
                        <tr key={key}>
                          <td className="px-3 md:px-6 py-4 text-sm text-gray-900">
                            {year}
                          </td>
                          <td className="px-3 md:px-6 py-4 text-sm text-gray-900">
                            {month}
                          </td>
                          {shopAccountTitleResponse.data?.map((accountTitle) => (
                            <td
                              key={accountTitle.id}
                              className="px-3 md:px-6 py-4 text-sm text-gray-900"
                            >
                              {amounts.get(accountTitle.id) ?? '-'}
                            </td>
                          ))}
                        </tr>
                      );
                    });
                  })()
                ) : (
                  <tr>
                    <td
                      colSpan={(shopAccountTitleResponse.data?.length || 0) + 2}
                      className="px-3 md:px-6 py-4 text-center text-gray-500 text-sm"
                    >
                      No account entries available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            hasMore={hasMore}
            loading={isFetchingShopAccountEntry}
            onPrevious={handlePrevPage}
            onNext={handleNextPage}
          />
        </div>
      </div>

      <div className="w-full bg-white shadow rounded-lg p-4 mt-4">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => router.push(`/shops/${shopId}/edit`)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-gray-700 text-sm md:text-base"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => router.push('/shops')}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm md:text-base"
          >
            Back
          </button>
        </div>

        <div className="flex space-x-4 mt-4">
          <div className="flex-1"></div>
          <button
            type="button"
            onClick={() => router.push(`/shops/${shopId}/delete`)}
            className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-gray-700 text-sm md:text-base"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
