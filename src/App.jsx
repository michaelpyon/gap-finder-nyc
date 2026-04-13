import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ReportPage from './pages/ReportPage'
import ComparePage from './pages/ComparePage'
import MethodologyPage from './pages/MethodologyPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/methodology" element={<MethodologyPage />} />
    </Routes>
  )
}

export default App
