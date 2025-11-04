import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/common/ProtectedRoute';
import AlertToast from './components/common/AlertToast';
import Loading from './components/common/Loading';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Plantations from './pages/Plantations';
import AddPlantation from './pages/AddPlantation';
import RegisterComplaint from './pages/RegisterComplaint';
import TrackComplaint from './pages/TrackComplaint';
import PollutionTracker from './pages/PollutionTracker';
import SolarFeasibility from './pages/SolarFeasibility';
import GreenCredits from './pages/GreenCredits';
import Profile from './pages/Profile';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <AlertToast />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/plantations" element={
          <ProtectedRoute><Plantations /></ProtectedRoute>
        } />
        <Route path="/plantations/add" element={
          <ProtectedRoute><AddPlantation /></ProtectedRoute>
        } />
        <Route path="/grievances" element={
          <ProtectedRoute><TrackComplaint /></ProtectedRoute>
        } />
        <Route path="/grievances/register" element={
          <ProtectedRoute><RegisterComplaint /></ProtectedRoute>
        } />
        <Route path="/pollution" element={
          <ProtectedRoute><PollutionTracker /></ProtectedRoute>
        } />
        <Route path="/solar" element={
          <ProtectedRoute><SolarFeasibility /></ProtectedRoute>
        } />
        <Route path="/green-credits" element={
          <ProtectedRoute><GreenCredits /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
