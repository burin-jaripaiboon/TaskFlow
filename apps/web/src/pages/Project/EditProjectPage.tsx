import { useNavigate, useParams } from "react-router-dom";
import EditProjectForm from "../../features/Project/EditProjectForm";
import { useEffect, useState } from "react";
import type { ProjectData } from '../../services/modelInterfaces';
import validateProjectOwner from "../../services/validateProjectOwner";

export default function EditProjectPage() {
  const [pageError, setPageError] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projectData, setProjectData] = useState<ProjectData>();
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) {
    return (
      <div>
        <p className='error-text'>No project ID given!</p>
      </div>
    );
  }

  useEffect(() => {
    
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const response = await validateProjectOwner({ projectId: id, getResponse: true });
        const { title, description, isPublicAccess } = response?.data.data || response?.data;
        setProjectData({
          title,
          description,
          isPublicAccess
        });
      } catch (err: any) {
        console.error("Error editing project:", err);
        setPageError('Failed to load project for editing. Check your console.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  const onProjectEdited = () => {
    navigate(`/projects/${id}`);
  }

  if (isLoading || !projectData) {
    return <div style={{ padding: '15px' }}>Loading editor...</div>;
  }

  if (pageError) {
    return (
      <div>
        <p className='error-text'>{pageError}</p>
      </div>
    );
  }

  return (
    <div>
      <EditProjectForm 
        onProjectEdited={onProjectEdited}
        initialData={projectData}
        projectId={id}
      />
    </div>
  );
}
