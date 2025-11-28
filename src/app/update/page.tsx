'use client';

import { useState } from 'react';
import { put } from '@/lib/api';

interface FormData {
  id: string;
  name: string;
  quantity: string;
  price: string;
}

interface UpdateResponse {
  message: string;
}

export default function UpdatePage() {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    name: '',
    quantity: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Example API call - replace with your actual API endpoint
    const response = await put<UpdateResponse>(`/api/items/${formData.id}`, {
      name: formData.name,
      quantity: parseInt(formData.quantity, 10),
      price: parseFloat(formData.price),
    });

    if (response.error) {
      setMessage({ type: 'error', text: response.error });
    } else {
      setMessage({ type: 'success', text: 'Item updated successfully!' });
    }

    setLoading(false);
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Update</h1>
      <p className="text-gray-600 mb-6">
        Update existing items. Enter the item ID and new values to update via the Web API.
      </p>

      {message && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
            Item ID
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Enter item ID to update"
          />
        </div>

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Enter new name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Enter new quantity"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Enter new price"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update Item'}
        </button>
      </form>
    </div>
  );
}
