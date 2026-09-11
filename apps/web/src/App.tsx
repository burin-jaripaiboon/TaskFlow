import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import api from './services/api';
import TaskBoard from './pages/TaskBoard';
import ProjectBoard from './pages/ProjectBoard';
import CreateProjectPage from './pages/CreateProjectPage';
import EditProjectPage from './pages/EditProjectPage';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApplicationLayout from './components/ApplicationLayout';
import DashBoard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectPage from './pages/ProjectPage';


export default function App() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [isInitializing, setIsInitializing] = useState(true);

  const isLoggedIn = !!accessToken;
  const initializeAuth = async () => {
    const hasSession = localStorage.getItem('hasSession');
    if (!hasSession) {
      setIsInitializing(false);
      return; 
    }

    try {
      const response = await api.post('/auth/renew', {} , { withCredentials: true });
      setAccessToken(response.data.accessToken);
    } catch (error) {
      console.log('No cookies')
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, [setAccessToken]);

  if (isInitializing) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>Loading TaskFlow...</p> 
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div>
        <main>
          <Routes>
            
            {/* Public Routes */}
            <Route path="/" element={<WelcomePage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={
              !isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" />
            } />
            
            <Route path="/register" element={
              !isLoggedIn ? <RegisterPage /> : <Navigate to="/dashboard" />
            } />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
              <Route element={<ApplicationLayout />}>
                <Route path="/dashboard" element={
                  <DashBoard />
                } />

                <Route path="/projects" element={
                  <ProjectBoard />
                } />

                <Route path="/projects/create" element={
                  <CreateProjectPage />
                } />

                <Route path="/projects/:id" element={
                  <ProjectPage />
                } />

                <Route path="/projects/:id/edit" element={
                  <EditProjectPage />
                } />
                
                <Route path="/tasks" element={
                  <TaskBoard />
                } />
                
                {/* Catch-all */}
                <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />} />
              </Route>
            </Route>
          </Routes>
        </main>
        
      </div>
    </BrowserRouter>
  );
}
