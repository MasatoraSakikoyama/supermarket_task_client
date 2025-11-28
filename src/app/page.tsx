import Link from 'next/link';

export default function Home() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Supermarket Task Management</h1>
      <p className="text-gray-600 mb-8">
        Welcome to the Supermarket Task Management application. Select a page to get started.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/summary"
          className="block p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Summary</h2>
          <p className="text-gray-600">View summary of all tasks and data</p>
        </Link>
        
        <Link 
          href="/register"
          className="block p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-green-800 mb-2">Register</h2>
          <p className="text-gray-600">Register new items or tasks</p>
        </Link>
        
        <Link 
          href="/update"
          className="block p-6 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Update</h2>
          <p className="text-gray-600">Update existing items or tasks</p>
        </Link>
        
        <Link 
          href="/delete"
          className="block p-6 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-red-800 mb-2">Delete</h2>
          <p className="text-gray-600">Delete items or tasks</p>
        </Link>
      </div>
    </div>
  );
}
