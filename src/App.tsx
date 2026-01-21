import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Plans from './pages/Plans'
import Planner from './pages/Planner'
import NutritionPlans from './pages/NutritionPlans'
import NutritionPlanView from './pages/NutritionPlanView'
import MealPlanView from './pages/MealPlanView'
import Clients from './pages/Clients'
import ClientDetail from './pages/ClientDetail'
import Step1FoodPreferences from './pages/wizard/Step1FoodPreferences'
import Step2AllergensExclusions from './pages/wizard/Step2AllergensExclusions'
import Step3ChooseRecipes from './pages/wizard/Step3ChooseRecipes'
import Step4FinalizePlan from './pages/wizard/Step4FinalizePlan'
import StepperDemo from './pages/StepperDemo'

function App() {
  // Use basename only in production (GitHub Pages), not in development
  const basename = import.meta.env.PROD ? '/pb-native-meal-planning-moderated-testing' : '';

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nutrition" element={<NutritionPlans />} />
        <Route path="/nutrition/plans/:planId" element={<NutritionPlanView />} />
        <Route path="/nutrition/plans/:planId/meal-plans/:mealPlanId" element={<MealPlanView />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:clientId" element={<ClientDetail />} />
        <Route path="/stepper-demo" element={<StepperDemo />} />
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
