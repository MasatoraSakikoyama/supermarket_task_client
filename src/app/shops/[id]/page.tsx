'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useShop, useShopAccountTitleList, useShopAccountEntryList } from '@/lib/hooks';
import { AccountPeriodTypeLabels, DEFAULT_PAGE_SIZE } from '@/constants';
import Pagination from '@/components/Pagination';
import Table, { Column } from '@/components/Table';
import MessageDisplay from '@/components/MessageDisplay';
import { ShopAccountTitleResponse } from '@/type/api';

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
  );

  const { data: shopAccountEntryResponse, isLoading: isFetchingShopAccountEntry, error: fetchShopAccountEntryError } = useShopAccountEntryList(
    token,
    shopId,
    offset,
    limit,
  );

  // Memoize unique periods calculation (must be before early returns)
  const uniquePeriods = useMemo(() => {
    const periods = new Set<string>();
    if (shopAccountEntryResponse?.data) {
      shopAccountEntryResponse.data.forEach((entry) => {
        periods.add(`${entry.year}-${entry.month}`);
      });
    }
    return Array.from(periods).sort();
  }, [shopAccountEntryResponse]);

  // Constants for styling
  const BORDER_RIGHT_HEADER_CLASS = 'px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200';
  const BORDER_RIGHT_CELL_CLASS = 'px-3 md:px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200';

  // Determine message to display
  let messageType: 'error' | 'loading' | null = null;
  let messageText = '';

  if (!shopId) {
    messageType = 'error';
    messageText = 'Error: No shop ID provided';
  } else if (isFetchingShop || isFetchingShopAccountTitle || isFetchingShopAccountEntry) {
    messageType = 'loading';
    messageText = 'Loading shop data...';
  } else if (fetchShopError || !shopResponse?.data || fetchShopAccountTitleError || !shopAccountTitleResponse || fetchShopAccountEntryError || !shopAccountEntryResponse) {
    messageType = 'error';
    const errors = [];
    if (fetchShopError || !shopResponse?.data) {
      errors.push(shopResponse?.error || 'Failed to fetch shop data');
    }
    if (fetchShopAccountTitleError || !shopAccountTitleResponse) {
      errors.push(shopAccountTitleResponse?.error || 'Failed to fetch shop account title data');
    }
    if (fetchShopAccountEntryError || !shopAccountEntryResponse) {
      errors.push(shopAccountEntryResponse?.error || 'Failed to fetch shop account entry data');
    }
    messageText = errors.length > 0 ? `Error: ${errors.join('. ')}` : 'Error: Failed to load data';
  }

  // Show message if there's an error or loading state
  if (messageType) {
    return (
      <div className="py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shop - Detail</h1>
        <MessageDisplay type={messageType} message={messageText} />
      </div>
    );
  }

  // At this point, all data is guaranteed to be loaded
  const shop = shopResponse!.data!;
  const shopAccountTitles = shopAccountTitleResponse!.data || [];
  const shopAccountEntries = shopAccountEntryResponse!;

  // Pagination handlers
  const handlePrevPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  const handleNextPage = () => {
    if (shopAccountEntries.data && shopAccountEntries.data.length >= limit) {
      setOffset(offset + limit);
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const hasMore = shopAccountEntries.data ? shopAccountEntries.data.length >= limit : false;

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
            {shop.name}
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
            {AccountPeriodTypeLabels[shop.period_type]}
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_cumulative"
              checked={shop.is_cumulative}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled
            />
            <span className="text-sm font-medium text-gray-700">Is Cumulative</span>
          </label>
        </div>
      </div>

      <div className="w-full bg-white shadow rounded-lg p-4 mt-4">
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl font-semibold mb-4">Shop Account Entries</h2>
          
          {/* Two-table layout: left for account titles, right for entries */}
          <div className="flex gap-0 overflow-x-auto">
            {/* Left table: Account Titles (no pagination) */}
            <div className="flex-shrink-0">
              <Table
                columns={[
                  {
                    key: 'name',
                    header: 'Account Title',
                    render: (item: ShopAccountTitleResponse) => (
                      <span className="font-medium">{item.name}</span>
                    ),
                    className: BORDER_RIGHT_HEADER_CLASS,
                    cellClassName: BORDER_RIGHT_CELL_CLASS,
                  },
                ]}
                data={shopAccountTitles}
                loading={isFetchingShopAccountTitle}
                emptyMessage="No account titles available."
                getRowKey={(item) => item.id}
                headerClassName={BORDER_RIGHT_HEADER_CLASS}
              />
            </div>

            {/* Right table: Account Entries by period */}
            <div className="flex-grow min-w-0">
              <Table
                columns={uniquePeriods.map((period) => {
                  const [year, month] = period.split('-');
                  return {
                    key: period,
                    header: `${year}/${month}`,
                    render: (item: ShopAccountTitleResponse) => {
                      // Find the amount for this account title and period
                      const entry = shopAccountEntries.data?.find(
                        (e) =>
                          e.shopp_account_title_id === item.id &&
                          `${e.year}-${e.month}` === period
                      );
                      return entry ? entry.amount : '-';
                    },
                  } as Column<ShopAccountTitleResponse>;
                })}
                data={shopAccountTitles}
                loading={isFetchingShopAccountTitle}
                emptyMessage="No entries available."
                getRowKey={(item) => item.id}
              />
            </div>
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
