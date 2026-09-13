import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateTaskForm from "../../features/Task/CreateTaskForm";
import validateProjectOwner from "../../services/validateProjectOwner";

export default function CreateTaskPage() {
  const [pageError, setPageError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { projectId } = useParams();
  if (!projectId) {
    return (
      <div>
        <p className='error-text'>No project ID given!</p>
      </div>
    );
  }
  const verifyOwner = async () => {
    setIsLoading(true);
    try {
      await validateProjectOwner({ projectId });
    } catch (err) {
      console.error('Failed to load task creator:', err)
      setPageError('Invalid request. Check console');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    verifyOwner();
  }, []);

  const onTaskCreated = () => {
    navigate(`/projects/${projectId}`);
  }

  if (isLoading) {
    return <div style={{ padding: '15px' }}>Loading task form...</div>;
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
      <CreateTaskForm 
        onTaskCreated={onTaskCreated}
        projectId={projectId}
      />
    </div>
  );
}
