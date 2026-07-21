import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import HomePage from './pages/Home/HomePage';
import WorkoutPage from './pages/Workout/WorkoutPage';
import WorkoutHome from './pages/Workout/WorkoutHome';
import DietPage from './pages/Diet/DietPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

// Dashboard Pages
import DashboardHome from './pages/Dashboard/DashboardPage';
import ProfilePage from './pages/Dashboard/ProfilePage';
import ProgressPage from './pages/Dashboard/ProgressPage';

import AIPage from './pages/Dashboard/AIPage';

// Trainer Module Pages
import TrainerHome from './pages/Dashboard/Trainer/TrainerHome';
import BrowseTrainers from './pages/Dashboard/Trainer/BrowseTrainers';
import TrainerProfile from './pages/Dashboard/Trainer/TrainerProfile';
import MyBookings from './pages/Dashboard/Trainer/MyBookings';

// Notifications
import NotificationsPage from './pages/Dashboard/NotificationsPage';

import NutritionCenter from './pages/Dashboard/NutritionCenter';

import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NotificationProvider>
        <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-50 dark:bg-[#0b0f1a]">
          {/* Global Animated Glass Background */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-400/20 dark:bg-primary-900/30 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-400/20 dark:bg-secondary-900/30 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-emerald-400/10 dark:bg-emerald-900/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" style={{ animationDelay: '4s' }} />
          </div>
          
          <div className="relative z-10 flex flex-col min-h-screen">
          <Routes>
            <Route path="/dashboard/*" element={null} />
            <Route path="/login" element={null} />
            <Route path="/register" element={null} />
            <Route path="/forgot-password" element={null} />
            <Route path="/reset-password/*" element={null} />
            <Route path="*" element={<Navbar />} />
          </Routes>
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/workouts" element={<WorkoutPage />} />
              <Route path="/diets" element={<DietPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

              {/* Dashboard Layout (Protected) */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardHome />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="workouts">
                  <Route index element={<WorkoutHome />} />
                  <Route path="library" element={<WorkoutPage />} />
                </Route>
                <Route path="diets" element={<DietPage />} />
                <Route path="progress" element={<ProgressPage />} />

                <Route path="ai" element={<AIPage />} />
                <Route path="nutrition" element={<NutritionCenter />} />
                <Route path="trainers">
                  <Route index element={<TrainerHome />} />
                  <Route path="browse" element={<BrowseTrainers />} />
                  <Route path=":id" element={<TrainerProfile />} />
                  <Route path="bookings" element={<MyBookings />} />
                </Route>
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          
          {/* Footer hidden on dashboard layout, auth pages, and specific public pages */}
          <Routes>
            <Route path="/dashboard/*" element={null} />
            <Route path="/login" element={null} />
            <Route path="/register" element={null} />
            <Route path="/forgot-password" element={null} />
            <Route path="/reset-password/*" element={null} />
            <Route path="/workouts" element={null} />
            <Route path="*" element={<Footer />} />
          </Routes>
          </div>
        </div>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#334155',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
            },
            success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        </NotificationProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
