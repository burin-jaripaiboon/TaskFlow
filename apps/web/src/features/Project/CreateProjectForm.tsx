import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import api from '../../services/api';
import type { ProjectData } from '../../services/modelInterfaces';

interface ProjectFormProps {
  onProjectCreated: () => void;
}

export default function CreateProjectForm({ onProjectCreated }: ProjectFormProps) {
  const [apiError, setApiError] = useState<string>('');
  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting } 
  } = useForm<ProjectData>({
    defaultValues: {
      title: '',
      description: '',
      isPublicAccess: false
    }
  });

  const onSubmit: SubmitHandler<ProjectData> = async (data) => {
    setApiError('');
    try {
      await api.post('/projects', data);
      onProjectCreated();
    } catch (err: any) {
      console.error("Error creating project:", err);
      setApiError(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div style={{ padding: '15px', marginBottom: '20px'}}>
      <h3 style={{ marginTop: 0 }}>Create New Project</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '10px' }}>
        {apiError && <p className='error-text'>{apiError}</p>}
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Project Title *</label>
          <input 
            type="text" 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            {...register('title', { 
              required: 'Project title is required',
              minLength: { value: 3, message: 'Title must be at least 3 characters' }
            })}
          />
          {errors.title && <span className='error-text' style={{ fontSize: '12px' }}>{errors.title.message}</span>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Description</label>
          <textarea 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '60px' }}
            {...register('description', {
              maxLength: { value: 500, message: 'Description is too long' }
            })}
          />
          {errors.description && <span className='error-text' style={{ fontSize: '12px' }}>{errors.description.message}</span>}
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              {...register('isPublicAccess')}
            />
            <span style={{ fontSize: '14px' }}>Anyone can view project</span>
          </label>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: '10px', 
            backgroundColor: isSubmitting ? '#ccc' : '#0066cc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}
