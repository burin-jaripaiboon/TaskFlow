import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import api from '../../services/api';
import type { ProjectData } from '../../services/modelInterfaces';

interface ProjectFormProps {
  onProjectEdited: () => void;
  initialData: ProjectData;
  projectId: string;
}

export default function EditProjectForm({ onProjectEdited, initialData, projectId }: ProjectFormProps) {
  const [apiError, setApiError] = useState<string>('');
  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting } 
  } = useForm<ProjectData>({
    defaultValues: {
      title: initialData.title,
      description: initialData.description,
      isPublicAccess: initialData.isPublicAccess
    }
  });

  const onSubmit: SubmitHandler<ProjectData> = async (data) => {
    setApiError('');
    try {
      await api.patch(`/projects/${projectId}`, data);
      onProjectEdited();
    } catch (err: any) {
      console.error("Error editing project:", err);
      setApiError(err.response?.data?.message || 'Failed to edit project');
    }
  };

  

  return (
    <div style={{ padding: '15px', marginBottom: '20px'}}>
      <h3 style={{ marginTop: 0 }}>Editing Project</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '10px' }}>
        {apiError && (<div className='error-text'>{apiError}</div>)}
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

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '14px', marginBottom: '5px' }}>Anyone can view project</label>
          <input 
            type="checkbox" 
            {...register('isPublicAccess')}
          />
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
          {isSubmitting ? 'Editing...' : 'Save Edit'}
        </button>
      </form>
    </div>
  );
}
