'use client';

import { useState } from 'react';
import { useDelete } from '@/lib/hooks';

interface DeleteResponse {
  message: string;
}

export default function DeletePage() {
  const [itemId, setItemId] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Use TanStack Query mutation hook
  const deleteMutation = useDelete<DeleteResponse>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      // Example API call - replace with your actual API endpoint
      const result = await deleteMutation.mutateAsync({
        url: `/api/items/${itemId}`,
      });

      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Item deleted successfully!' });
        setItemId('');
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete item' });
    }
  };

  return (
    <div className="py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Delete</h1>
      <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
        Delete existing items. Enter the item ID to delete via the Web API.
      </p>

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

      <form onSubmit={handleSubmit} className="max-w-full md:max-w-md bg-white shadow rounded-lg p-4 md:p-6">
        <div className="mb-4 md:mb-6">
          <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-1">
            Item ID
          </label>
          <input
            type="text"
            id="itemId"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm md:text-base"
            placeholder="Enter item ID to delete"
          />
        </div>

        <button
          type="submit"
          disabled={deleteMutation.isPending || !itemId}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Item'}
        </button>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Warning: This action cannot be undone.
        </p>
      </form>
    </div>
  );
}
