import { useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    identifier: ''
  });
  
  const [error, setError] = useState<string>('');


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === 'name') { 
      value = value.toLowerCase();
      value = value.replace(/[^a-z0-9_]/g, '');
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    setError('');       

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const url = `http://localhost:5000${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('token', data.token);
      
      alert('Authentication successful!');
      
      window.location.reload();
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Log In' : 'Create an Account'}</h2>
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {!isLogin? (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block' }}>Username (a-z, 0-9, _ only)</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required={!isLogin} 
            />
            <label style={{ display: 'block' }}>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          ) : (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block' }}>Email or Username</label>
            <input 
              type="text" 
              name="identifier" 
              value={formData.identifier} 
              onChange={handleChange} 
              required 
            />
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block' }}>Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          {isLogin ? 'Log In' : 'Register'}
        </button>
      </form>

      <button 
        type="button" 
        onClick={() => setIsLogin(!isLogin)}
        style={{ 
          marginTop: '1.5rem', 
          background: 'none', 
          border: 'none', 
          color: '#0066cc', 
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
      >
        {isLogin ? 'Need an account? Register' : 'Already have an account? Log in'}
      </button>
    </div>
  );
}