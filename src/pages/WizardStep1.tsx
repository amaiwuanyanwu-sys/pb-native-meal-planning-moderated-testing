import { Link } from 'react-router-dom'

export default function WizardStep1() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Nutrition Plan</h1>
          <p className="text-gray-600">Step 1 of 4</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tell us about yourself
          </h2>
          <p className="text-gray-600 mb-6">
            Wizard Step 1 content will go here
          </p>

          <div className="flex justify-between mt-8">
            <Link
              to="/"
              className="px-6 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Link>
            <Link
              to="/wizard/step-2"
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
