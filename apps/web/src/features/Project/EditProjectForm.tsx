import { useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import api from '../../services/api';
import { useParams } from 'react-router-dom';
import type { ProjectData } from '../../services/modelInterfaces';

interface ProjectFormProps {
  onProjectEdited: () => void;
  initialData: ProjectData;
}

export default function EditProjectForm({ onProjectEdited, initialData }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectData>({
    title: initialData.title,
    description: initialData.description,
    isPublicAccess: initialData.isPublicAccess
  });
  const [submitError, setSubmitError] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { id } = useParams();

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
    setIsEditing(true);

    try {
      await api.put(`/projects/${id}`, formData);
      onProjectEdited();
    } catch (err: any) {
      console.error("Error editing project:", err);
      setSubmitError(err.response?.data?.message || 'Failed to edit project');
      setIsEditing(false);
    }
  };

  

  return (
    <div style={{ padding: '15px', marginBottom: '20px'}}>
      <h3 style={{ marginTop: 0 }}>Editing Project</h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '10px' }}>
        {submitError && (<div className='error-text'>{submitError}</div>)}
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
          disabled={isEditing}
          style={{ 
            padding: '10px', 
            backgroundColor: isEditing ? '#ccc' : '#0066cc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: isEditing ? 'not-allowed' : 'pointer'
          }}
        >
          {isEditing ? 'Editing...' : 'Save Edit'}
        </button>
      </form>
    </div>
  );
}
