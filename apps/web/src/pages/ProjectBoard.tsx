import { useState, useEffect } from 'react';
import api from '../services/api';
import ProjectForm from '../features/ProjectForm';


interface Project {
  _id: string;
  title: string;
  description: string;
}

export default function ProjectBoard() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get('/projects');
      const projectArray = response.data.data || response.data;
      
      if (Array.isArray(projectArray)) {
        setProjects(projectArray);
      } else {
        setProjects([]);
      }
    } catch (err: any) {
      console.error("Error loading projects", err);
      setError('Failed to load projects. Check your console.');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  
  const handleProjectCreated = () => {
    setShowForm(false);
    fetchProjects();
  };

  if (loading && projects.length === 0) {
    return <div>Loading your projects...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <title>Projects | TaskFlow</title>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Your Projects</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '8px 12px', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && <ProjectForm onProjectCreated={handleProjectCreated} />}
      
      {projects.length === 0 ? (
        <p>No projects found. Time to create one!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {projects.map((project) => (
            <div 
              key={project._id} 
              style={{ 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '5px' 
              }}
            >
              <strong>{project.title}</strong>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                {project.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
