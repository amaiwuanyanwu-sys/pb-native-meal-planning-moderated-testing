import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Meal Planning App
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Create personalized nutrition plans and organize your meals for the week
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/wizard/step-1"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create New Plan
          </Link>
          <Link
            to="/plans"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
          >
            View My Plans
          </Link>
        </div>
      </div>
    </div>
  )
}
