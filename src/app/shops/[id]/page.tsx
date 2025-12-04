'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useShop, useShopAccountTitleList } from '@/lib/hooks';
import { AccountPeriodTypeLabels } from '@/constants';

export default function ShopsDetailPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const token = getToken();
  const params = useParams<{ id: string }>();
  const shopId = params.id ? parseInt(params.id, 10) : 0;

  // Fetch data
  const { data: shopResponse, isLoading: isFetchingShop, error: fetchShopError } = useShop(
    token,
    shopId
  );

  const offset = 0;
  const limit = 10;
  const { data: shopAccountTitleResponse, isLoading: isFetchingShopAccountTitle, error: fetchShopAccountTitleError } = useShopAccountTitleList(
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

  if (isFetchingShop || isFetchingShopAccountTitle) {
    return (
      <div className="py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shop - Detail</h1>
        <div className="text-gray-600">Loading shop data...</div>
      </div>
    );
  }

  if (fetchShopError || !shopResponse?.data || fetchShopAccountTitleError || !shopAccountTitleResponse) {
    return (
      <div className="py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shop - Detail</h1>
        <div className="mb-4 md:mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          Error: {shopResponse?.error || 'Failed to fetch shop data'} {shopAccountTitleResponse?.error || 'Failed to fetch shop account title data'}
        </div>
      </div>
    );
  }

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
          <h2 className="text-xl font-semibold mb-4">Shop Account Titles</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {shopAccountTitleResponse.data && shopAccountTitleResponse.data.length > 0 ? (
                  shopAccountTitleResponse.data.map((accountTitle) => (
                    <tr key={accountTitle.id}>
                      <td className="px-3 md:px-6 py-4 text-sm text-gray-900">
                        {accountTitle.name}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 md:px-6 py-4 text-center text-gray-500 text-sm">
                      No account titles available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
