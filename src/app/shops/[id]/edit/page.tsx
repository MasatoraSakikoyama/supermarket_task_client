'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useShop, useUpdateShop } from '@/lib/hooks';
import { AccountPeriodType, AccountPeriodTypeLabels } from '@/constants';

interface FormData {
  name: string;
  period_type: AccountPeriodType;
  is_cumulative: boolean;
}

export default function ShopsEditPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const token = getToken();
  const params = useParams<{ id: string }>();
  const shopId = params.id ? parseInt(params.id, 10) : 0;


  const [formData, setFormData] = useState<FormData>({
    name: '',
    period_type: AccountPeriodType.Monthly,
    is_cumulative: false,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch shop data
  const { data: shopResponse, isLoading: isFetching, error: fetchError } = useShop(
    token,
    shopId
  );

  // Update shop mutation
  const updateMutation = useUpdateShop();

  // Populate form when shop data is loaded
  useEffect(() => {
    if (shopResponse?.data) {
      const shop = shopResponse.data;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Valid use case: syncing external API data to form state
      setFormData({
        name: shop.name,
        period_type: shop.period_type,
        is_cumulative: shop.is_cumulative,
      });
    }
  }, [shopResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'period_type') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!token || !shopId) {
      setMessage({ type: 'error', text: 'Invalid shop ID or authentication token' });
      return;
    }

    try {
      const result = await updateMutation.mutateAsync({
        token,
        shopId,
        data: {
          name: formData.name,
          period_type: formData.period_type,
          is_cumulative: formData.is_cumulative,
        },
      });

      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Shop updated successfully!' });
        // Optionally navigate back to shops list after a delay
        setTimeout(() => {
          router.push(`/shops/${shopId}`);
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update shop';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  if (!shopId) {
    return (
      <div className="py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shop - Edit</h1>
        <div className="mb-4 md:mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          Error: No shop ID provided
        </div>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shop - Edit</h1>
        <div className="text-gray-600">Loading shop data...</div>
      </div>
    );
  }

  if (fetchError || !shopResponse?.data) {
    return (
      <div className="py-4 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shop - Edit</h1>
        <div className="mb-4 md:mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          Error: {shopResponse?.error || 'Failed to fetch shop data'}
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Shop - Edit</h1>

      {message && (
        <div
          className={`mb-4 md:mb-6 p-4 rounded-md text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full bg-white shadow rounded-lg p-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              placeholder="Enter shop name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="period_type" className="block text-sm font-medium text-gray-700 mb-1">
              Period Type
            </label>
            <select
              id="period_type"
              name="period_type"
              value={formData.period_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            >
              {Object.entries(AccountPeriodTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_cumulative"
                checked={formData.is_cumulative}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Is Cumulative</span>
            </label>
          </div>
        </div>
        
        <div className="w-full bg-white shadow rounded-lg p-4 mt-4">
          <div className="mb-4">

          </div>
        </div>
        
        <div className="w-full bg-white shadow rounded-lg p-4 mt-4">
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {updateMutation.isPending ? 'Updating...' : 'Update'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/shops/${shopId}`)}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm md:text-base"
            >
              Back
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
