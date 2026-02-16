import { Box } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './components/LoginPage.jsx'
import RegisterPage from './components/RegisterPage.jsx'
import DashboardPage from './components/DashboardPage.jsx'
import HundredMeterPage from './components/HundredMeterPage.jsx'
import JavelinTossPage from './components/JavelinTossPage.jsx'
import LongJumpPage from './components/LongJumpPage.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/hundred-meter" element={<HundredMeterPage />} />
          <Route path="/long-jump" element={<LongJumpPage />} />
          <Route path="/javelin-toss" element={<JavelinTossPage />} />
        </Route>
      </Routes>
    </Box>
  )
}
export default App