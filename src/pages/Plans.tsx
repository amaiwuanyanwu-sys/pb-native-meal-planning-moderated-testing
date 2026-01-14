import { Link } from 'react-router-dom'

export default function Plans() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Nutrition Plans</h1>
          <Link
            to="/wizard/step-1"
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Create New Plan
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder plan card */}
          <Link
            to="/plans/1"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sample Plan
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Created on Jan 14, 2026
            </p>
            <div className="text-sm text-gray-500">
              Click to view details
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
