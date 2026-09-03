import { useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import api from '../services/api';

interface ProjectFormProps {
  onProjectCreated: () => void;
}

export default function ProjectCreationForm({ onProjectCreated }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublicAccess: false
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name: event_name, value: event_value, type: event_type } = e.target;
    
    const isCheckbox = event_type === 'checkbox';
    const event_checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;

    setFormData(prev => ({
      ...prev,
      [event_name]: isCheckbox ? event_checked : event_value
    }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/projects', formData);
      
      setFormData({ title: '', description: '', isPublicAccess: false });
      
      onProjectCreated();
      
    } catch (err: any) {
      console.error("Error creating project:", err);
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginTop: 0 }}>Create New Project</h3>
      
      {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', textAlign: 'left', fontSize: '14px', marginBottom: '5px' }}>Project Title *</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', textAlign: 'left', fontSize: '14px', marginBottom: '5px' }}>Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '60px' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ textAlign: 'left' , fontSize: '14px', marginBottom: '5px' }}>Anyone can view project</label>
          <input 
            type="checkbox" 
            name="isPublicAccess"
            checked={formData.isPublicAccess}
            onChange={handleChange}
            style={{ boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            padding: '10px', 
            backgroundColor: isLoading ? '#ccc' : '#0066cc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}
