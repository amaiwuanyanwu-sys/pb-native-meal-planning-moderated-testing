import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import WizardStep1 from './pages/WizardStep1'
import Plans from './pages/Plans'
import Planner from './pages/Planner'
import NutritionPlans from './pages/NutritionPlans'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wizard/step-1" element={<WizardStep1 />} />
        <Route path="/nutrition-plans" element={<NutritionPlans />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/plans/:planId/planner" element={<Planner />} />
      </Routes>
    </Router>
  )
}

export default App
