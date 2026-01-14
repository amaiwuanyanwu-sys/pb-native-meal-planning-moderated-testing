import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Plans from './pages/Plans'
import Planner from './pages/Planner'
import NutritionPlans from './pages/NutritionPlans'
import Step1NutritionGoals from './pages/wizard/Step1NutritionGoals'
import Step2FoodPreferences from './pages/wizard/Step2FoodPreferences'
import Step3AllergensExclusions from './pages/wizard/Step3AllergensExclusions'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/nutrition" replace />} />
        <Route path="/nutrition" element={<NutritionPlans />} />
        <Route path="/clients" element={<Home />} />
        <Route path="/wizard/step-1" element={<Step1NutritionGoals />} />
        <Route path="/wizard/step-2" element={<Step2FoodPreferences />} />
        <Route path="/wizard/step-3" element={<Step3AllergensExclusions />} />
        <Route path="/nutrition-plans" element={<NutritionPlans />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/plans/:planId/planner" element={<Planner />} />
      </Routes>
    </Router>
  )
}

export default App
