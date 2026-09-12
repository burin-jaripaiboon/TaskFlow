import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Project } from "../../services/modelInterfaces";
import { useAuthStore } from "../../stores/useAuthStore";
import api from "../../services/api";
import NavButton from "../../components/utilities/NavButton";

export default function ProjectPage() {
  const [project, setProject] = useState<Project>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { id } = useParams();
  useEffect(() => {
    const userToken = useAuthStore.getState().accessToken;
    if (userToken) {
      try {
        const payload = JSON.parse(atob(userToken.split('.')[1]));
        setCurrentUserId(payload.userId); 
      } catch (e) {
        console.error("Failed to decode token");
      }
    }
  }, []);
  const fetchProject = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.data || response.data);

    } catch (err: any) {
      console.error("Error loading project", err);
      setError('Failed to load project. Check your console.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProject();
  } , [id])

  if (loading) {
    return <div>Loading project...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {project? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <title>Project - {project.title} | TaskFlow</title>
            <span style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <h2>{project.title}</h2>
              { project.ownerId === currentUserId && (<Link className='link-color' to={`/projects/${id}/edit`}>✎ Edit</Link>) }
            </span>
            <p>{project.isPublicAccess? "Public" : "Restricted"}</p>
          </div>
          <div style={{ textAlign: 'left', gap: '10px' }}>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                {project.description}
              </p>
              { project.ownerId === currentUserId && (<NavButton to={`/projects/${id}/tasks/create`}>+ New Task</NavButton>) }
          </div>
        </div>
      ) : (
        <div>
          <title>Project Not Found | TaskFlow</title>
          <h1>Project Not Found!</h1>
          <h2>The given project ID doesn't exist in the database!</h2>
        </div>
      )}
    </div>
  );
}
