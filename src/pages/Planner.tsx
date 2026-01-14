import { Link, useParams } from 'react-router-dom'

export default function Planner() {
  const { planId } = useParams()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/plans" className="text-gray-600 hover:text-gray-900 mb-2 inline-block">
            ← Back to Plans
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Meal Planner</h1>
          <p className="text-gray-600">Plan ID: {planId}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-600">
            Meal planner interface will go here - with weekly calendar, meal slots, and drag-and-drop functionality
          </p>
        </div>
      </div>
    </div>
  )
}
