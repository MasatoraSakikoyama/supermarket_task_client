'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useShop, useShopAccountTitleList, useShopAccountEntryList, useCreateShopAccountEntryList } from '@/lib/hooks';
import { AccountPeriodTypeLabels } from '@/constants';
import Table, { Column } from '@/components/Table';
import EditableTableFrom2D from '@/components/EditableTableFrom2D';
import MessageDisplay from '@/components/MessageDisplay';
import { ShopAccountTitleResponse } from '@/type/api';

export default function ShopsEditPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const token = getToken();
  const params = useParams<{ id: string }>();
  const shopId = parseInt(params.id, 10);
  const searchParams = useSearchParams();
  const year = parseInt(searchParams.get('year'), 10);

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
    year,
  );

  // Mutation for saving account entries
  const createShopAccountEntryList = useCreateShopAccountEntryList();

  // At this point, all data is guaranteed to be loaded
  const shop = shopResponse?.data || {};
  const shopAccountTitlesRevenues = shopAccountTitleResponse?.data?.revenues || [];
  const shopAccountTitlesExpenses = shopAccountTitleResponse?.data?.expenses || [];
  const shopAccountEntriesHeaders = shopAccountEntryResponse?.data?.headers || [];
  const shopAccountEntriesRevenues = shopAccountEntryResponse?.data?.revenues || [];
  const shopAccountEntriesExpenses = shopAccountEntryResponse?.data?.expenses || [];

  // State for editable data
  const [editedRevenues, setEditedRevenues] = useState(shopAccountEntriesRevenues);
  const [editedExpenses, setEditedExpenses] = useState(shopAccountEntriesExpenses);

  // Handle cell changes
  const handleRevenueChange = (rowIndex: number, colIndex: number, value: string) => {
    let amount = value === '' ? null : parseInt(value, 10);
    if (amount !== null && isNaN(amount)) {
        amount = null;
    }

    const updatedData = [...editedRevenues];
    updatedData[rowIndex][colIndex].amount = amount;
    setEditedRevenues(updatedData);
  };

  const handleExpenseChange = (rowIndex: number, colIndex: number, value: string) => {
    let amount = value === '' ? null : parseInt(value, 10);
    if (amount !== null && isNaN(amount)) {
        amount = null;
    }

    const updatedData = [...editedExpenses];
    updatedData[rowIndex][colIndex].amount = amount;
    setEditedExpenses(updatedData);
  };

  // Handle save
  const handleSave = async () => {
    try {
      await createShopAccountEntryList.mutateAsync({
        token,
        shopId,
        data: {
          year,
          revenues: editedRevenues,
          expenses: editedExpenses,
        },
      });
      // Navigate back to detail page after successful save
      router.push(`/shops/${shopId}`);
    } catch (error) {
      console.error('Failed to save account entries:', error);
    }
  };

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

  return (
    <div className="py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shop - Edit</h1>

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
          <div className="flex gap-0 overflow-x-auto">
            <div className="flex-shrink-0 min-w-1/4">
              <Table
                headers={['Revenunes']}
                columns={[
                  {
                    key: 'name',
                    render: (item: any) => (
                      <span className="font-medium">{item.name}</span>
                    ),
                    cellClassName: BORDER_RIGHT_CELL_CLASS,
                  },
                ]}
                data={shopAccountTitlesRevenues}
                loading={isFetchingShopAccountTitle}
                emptyMessage="No account titles available."
                headerClassName={BORDER_RIGHT_HEADER_CLASS}
              />
            </div>

            <div className="flex-grow min-w-0">
              <EditableTableFrom2D
                headers={shopAccountEntriesHeaders}
                data={editedRevenues}
                getValue={(item) => item.amount !== null ? item.amount : ''}
                onChange={handleRevenueChange}
                loading={isFetchingShopAccountTitle}
              />
            </div>
          </div>

          <div className="flex gap-0 overflow-x-auto">
            <div className="flex-shrink-0 min-w-1/4">
              <Table
                headers={['Expenses']}
                columns={[
                  {
                    key: 'name',
                    render: (item: any) => (
                      <span className="font-medium">{item.name}</span>
                    ),
                    cellClassName: BORDER_RIGHT_CELL_CLASS,
                  },
                ]}
                data={shopAccountTitlesExpenses}
                loading={isFetchingShopAccountTitle}
                emptyMessage="No account titles available."
                headerClassName={BORDER_RIGHT_HEADER_CLASS}
              />
            </div>

            <div className="flex-grow min-w-0">
              <EditableTableFrom2D
                headers={shopAccountEntriesHeaders}
                data={editedExpenses}
                getValue={(item) => item.amount !== null ? item.amount : ''}
                onChange={handleExpenseChange}
                loading={isFetchingShopAccountTitle}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white shadow rounded-lg p-4 mt-4">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm md:text-base"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push(`/shops/${shopId}`)}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm md:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
