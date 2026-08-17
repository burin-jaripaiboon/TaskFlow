import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import AuthForm from './features/AuthForm';
import TaskBoard from './features/TaskBoard';
import ProjectBoard from './features/ProjectBoard';

export default function App() {
  // Check if a token exists in browser memory, explicitly typed as a boolean
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));

  // A simple logout function for testing
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };
  if (!isLoggedIn) {
    return <AuthForm />;
  }


  return (
    <BrowserRouter>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0px', fontFamily: 'sans-serif' }}>
        
        {/* The Navigation Bar */}
        <header style={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid #eee', 
          paddingBottom: '10px' 
        }}>
          <h1 style={{ margin: 30 }}>TaskFlow</h1>
          
          <nav style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#0066cc', fontWeight: 'bold' }}>Dashboard</Link>
            <Link to="/projects" style={{ textDecoration: 'none', color: '#333' }}>Projects</Link>
            <Link to="/tasks" style={{ textDecoration: 'none', color: '#333' }}>Tasks</Link>
            
            <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer', marginLeft: '10px' }}>
              Log Out
            </button>
          </nav>
        </header>

        {/* The Dynamic Content Area */}
        <main style={{ marginTop: '20px' }}>
          <Routes>
            
            {/* Route 1: The Side-by-Side Dashboard */}
            <Route path="/" element={
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}><ProjectBoard /></div>
                <div style={{ flex: 1 }}><TaskBoard /></div>
              </div>
            } />
            
            {/* Route 2: Dedicated Projects Page */}
            <Route path="/projects" element={<ProjectBoard />} />
            
            {/* Route 3: Dedicated Tasks Page */}
            <Route path="/tasks" element={<TaskBoard />} />
            
            {/* Catch-all: If user types a random URL, redirect to Dashboard */}
            <Route path="*" element={<Navigate to="/" />} />
            
          </Routes>
        </main>
        
      </div>
    </BrowserRouter>
  );
}