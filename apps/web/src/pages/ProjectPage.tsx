import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Project } from "../services/modelInterfaces";
import api from "../services/api";

export default function ProjectPage() {
  const [project, setProject] = useState<Project>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const { id } = useParams();
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
  } , [])

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
            <h2>{project.title}</h2>
            <p>{project.isPublicAccess? "Public" : "Restricted"}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                {project.description}
              </p>
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
