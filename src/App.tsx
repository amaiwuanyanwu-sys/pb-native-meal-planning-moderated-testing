import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Plans from './pages/Plans'
import Planner from './pages/Planner'
import NutritionPlans from './pages/NutritionPlans'
import Step1FoodPreferences from './pages/wizard/Step1FoodPreferences'
import Step2AllergensExclusions from './pages/wizard/Step2AllergensExclusions'
import Step3ChooseRecipes from './pages/wizard/Step3ChooseRecipes'
import Step4FinalizePlan from './pages/wizard/Step4FinalizePlan'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/nutrition" replace />} />
        <Route path="/nutrition" element={<NutritionPlans />} />
        <Route path="/clients" element={<Home />} />
        <Route path="/wizard/step-1" element={<Step1FoodPreferences />} />
        <Route path="/wizard/step-2" element={<Step2AllergensExclusions />} />
        <Route path="/wizard/step-3" element={<Step3ChooseRecipes />} />
        <Route path="/wizard/step-4" element={<Step4FinalizePlan />} />
        <Route path="/nutrition-plans" element={<NutritionPlans />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/plans/:planId/planner" element={<Planner />} />
      </Routes>
    </Router>
  )
}

export default App
