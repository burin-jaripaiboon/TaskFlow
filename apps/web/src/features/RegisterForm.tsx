import { useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import NavButton from '../components/utilities/NavButton';
import api from '../services/api';

export default function RegisterForm({ setIsLoggedIn }: { setIsLoggedIn: (isLoggedIn: boolean) => void }) {
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
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
  
      try {
        const response = await api.post('/auth/register', formData);
  
        localStorage.setItem('token', response.data.token);
        
        setIsLoggedIn(true);
        
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Authentication failed';
        setError(errorMessage);
      }
    };
  return (
    <div className="auth-container">
      <h2>Create an Account</h2>
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block' }}>Username (a-z, 0-9, _ only)</label>
          <input 
            type="text" 
            name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
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

        <button type="submit" style={{ marginTop: '1em', cursor: 'pointer' }}>
          Register
        </button>
      </form>

      <NavButton 
        to="/login"
        style={{ 
          marginTop: '1.5rem', 
          background: 'none', 
          border: 'none', 
          color: '#0066cc', 
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
      >
        Already have an account? Log in
      </NavButton>
    </div>
  );
}
