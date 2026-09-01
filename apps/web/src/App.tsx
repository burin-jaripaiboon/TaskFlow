import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <div>
        <main>
          <Routes>
            
            {/* Public Routes */}
            <Route path="/" element={<WelcomePage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={
              !isLoggedIn ? <LoginPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />
            } />
            
            <Route path="/register" element={
              !isLoggedIn ? <RegisterPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />
            } />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
              <Route element={<ApplicationLayout setIsLoggedIn={setIsLoggedIn} />}>
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
