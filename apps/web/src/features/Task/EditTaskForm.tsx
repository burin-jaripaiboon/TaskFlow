import { useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import api from '../../services/api';
import type { TaskData } from '../../services/modelInterfaces';
import { useParams } from 'react-router-dom';

interface TaskFormProps {
  onTaskEdited: () => void;
}

export default function EditTaskForm({ onTaskEdited }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskData>({
    title: '',
    description: '',
    assignedName: '',
    status: 'TO_DO',
    priority: 0
  });
  const [submitError, setSubmitError] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { projectId } = useParams();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');
    setIsCreating(true);

    try {
      await api.post('/tasks', {
        ...formData,
        projectId
      });
      onTaskEdited();
    } catch (err: any) {
      console.error("Error creating task:", err);
      setSubmitError(err.response?.data?.message || 'Failed to create task');
      setIsCreating(false);
    }
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginTop: 0 }}>Create New Task</h3>
      
      {submitError && <p style={{ color: 'red', fontSize: '14px' }}>{submitError}</p>}
      
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Task Title *</label>
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
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Task Description</label>
            <input 
              type="text" 
              name="description" 
              value={formData.description} 
              onChange={handleChange}  
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Assignee (Username)</label>
            <input 
              type="text" 
              name="assignedName" 
              value={formData.assignedName} 
              onChange={handleChange}  
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Priority (Higher Number = Higher Priority)</label>
            <input 
              type="number" 
              name="priority" 
              value={formData.priority} 
              onChange={handleChange}  
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              <option value="TO_DO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
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
              cursor: isCreating ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {isCreating ? 'Creating...' : 'Create Task'}
          </button>
        </form>
    </div>
  );
}
