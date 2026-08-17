import { useEffect, useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import api from '../services/api';

interface TaskFormProps {
  onTaskCreated: () => void;
}

interface Project {
  _id: string;
  title: string;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    projectId: '',
    description: '',
    assignedName: '',
    status: 'TODO'
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      const projectArray = response.data.data || response.data;
      
      if (Array.isArray(projectArray)) {
        setProjects(projectArray);
        // Auto-select the first project in the list if available
        if (projectArray.length > 0) {
          setFormData(prev => ({ ...prev, projectId: projectArray[0]._id }));
        }
      }
    } catch (err) {
      console.error("Error loading projects for dropdown", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Send the data to your POST /api/tasks route
      await api.post('/tasks', formData);
      
      // Clear the form
      setFormData(prev => ({ ...prev, title: '', status: 'TODO' }));
      
      // Tell the parent component to re-fetch the list
      onTaskCreated();
      
    } catch (err: any) {
      console.error("Error creating task:", err);
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginTop: 0 }}>Create New Task</h3>
      
      {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
      
      {loadingProjects ? (
        <p style={{ fontSize: '14px', color: '#666' }}>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p style={{ color: 'red', fontSize: '14px' }}>You must create a project before you can create a task.</p>
      ) : (
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
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Assign to Project</label>
            <select 
              name="projectId" 
              value={formData.projectId} 
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Assignee (Name)</label>
            <input 
              type="text" 
              name="assignedName" 
              value={formData.assignedName} 
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
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
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
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {isLoading ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      )}
    </div>
  );
}