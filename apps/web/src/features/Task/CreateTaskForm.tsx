import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import api from '../../services/api';
import type { TaskData } from '../../services/modelInterfaces';

interface TaskFormProps {
  onTaskCreated: () => void;
  projectId: string;
}

export default function CreateTaskForm({ onTaskCreated, projectId }: TaskFormProps) {
  const [apiError, setApiError] = useState<string>('');
  const { 
      register, 
      handleSubmit,
      formState: { errors, isSubmitting } 
    } = useForm<TaskData>({
      defaultValues: {
        title: '',
        description: '',
        assignedName: '',
        status: 'TODO',
        priority: 0
      }
    });

  const onSubmit: SubmitHandler<TaskData> = async (data) => {
    setApiError('');
    try {
      await api.post('/tasks', { ...data, projectId });
      onTaskCreated();
    } catch (err: any) {
      console.error("Error creating project:", err);
      setApiError(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div style={{ padding: '15px', marginBottom: '20px'}}>
      <h3 style={{ marginTop: 0 }}>Create New Task</h3>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '10px' }}>
        {apiError && <p style={{ color: 'red', fontSize: '14px' }}>{apiError}</p>}
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Task Title *</label>
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
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Assignee (Username)</label>
          <input 
            type="text" 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            {...register('assignedName')}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Priority (Higher Number = Higher Priority)</label>
          <input 
            type="number" 
            step="1"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            {...register('priority', {
              valueAsNumber: true,
              validate: (value) => {
                if (!value && value !== 0 && Number.isNaN(value)) return true; 
                return Number.isInteger(value) || 'Priority must be a whole number';
              }
            })}
          />
          {errors.priority && <span className='error-text' style={{ fontSize: '12px' }}>{errors.priority.message}</span>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Status</label>
          <select 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            {...register('status')}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
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
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}
