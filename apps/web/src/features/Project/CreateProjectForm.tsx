import { useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import api from '../../services/api';
import type { ProjectData } from '../../services/modelInterfaces';

interface ProjectFormProps {
  onProjectCreated: () => void;
}

export default function CreateProjectForm({ onProjectCreated }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectData>({
    title: '',
    description: '',
    isPublicAccess: false
  });
  const [submitError, setSubmitError] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);

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
    setSubmitError('');
    setIsCreating(true);

    try {
      await api.post('/projects', formData);
      
      setFormData({ title: '', description: '', isPublicAccess: false });
      
      onProjectCreated();
      
    } catch (err: any) {
      console.error("Error creating project:", err);
      setSubmitError(err.response?.data?.message || 'Failed to create project');
      setIsCreating(false);
    }
  };

  return (
    <div style={{ padding: '15px', marginBottom: '20px'}}>
      <h3 style={{ marginTop: 0 }}>Create New Project</h3>
      
      {submitError && <p style={{ color: 'red', fontSize: '14px' }}>{submitError}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Project Title *</label>
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
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '60px' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '14px', marginBottom: '5px' }}>Anyone can view project</label>
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
          disabled={isCreating}
          style={{ 
            padding: '10px', 
            backgroundColor: isCreating ? '#ccc' : '#0066cc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: isCreating ? 'not-allowed' : 'pointer'
          }}
        >
          {isCreating ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}
