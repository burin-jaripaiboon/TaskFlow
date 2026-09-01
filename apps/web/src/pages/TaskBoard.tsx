import { useState, useEffect } from 'react';
import api from '../services/api';
import TaskCreationForm from '../features/TaskCreationForm';


interface Task {
  _id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export default function TaskBoard() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tasks');
      const taskArray = response.data.data || response.data;
      
      if (Array.isArray(taskArray)) {
        setTasks(taskArray);
      } else {
        setTasks([]);
      }
    } catch (err: any) {
      console.error("Error loading tasks", err);
      setError('Failed to load tasks. Check your console.');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  
  const handleTaskCreated = () => {
    setShowCreateForm(false);
    fetchTasks();    
  };


  if (loading && tasks.length === 0) {
    return <div>Loading your tasks...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <title>Tasks | TaskFlow</title>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Your Tasks</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{ padding: '8px 12px', cursor: 'pointer' }}
        >
          {showCreateForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showCreateForm && <TaskCreationForm onTaskCreated={handleTaskCreated} />}
      
      {tasks.length === 0 ? (
        <p>No tasks found. Time to create one!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.map((task) => (
            <div 
              key={task._id} 
              style={{ 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '5px' 
              }}
            >
              <strong>{task.title}</strong>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                Status: {task.status.replace('_', ' ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
