'use client';

import { useState, useEffect } from 'react';
import { get } from '@/lib/api';

interface SummaryData {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export default function SummaryPage() {
  const [data, setData] = useState<SummaryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    
    // Example API call - replace with your actual API endpoint
    const response = await get<SummaryData[]>('/api/summary');
    
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setData(response.data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    // Uncomment to fetch data on page load
    // fetchSummary();
  }, []);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Summary</h1>
      <p className="text-gray-600 mb-6">
        View and manage summary data. Connect to your Web API to display real data.
      </p>

      <div className="mb-6">
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Fetch Summary Data'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          Error: {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No data available. Click &quot;Fetch Summary Data&quot; to load data from the API.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.price.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
