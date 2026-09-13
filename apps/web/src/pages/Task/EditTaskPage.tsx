import { useNavigate, useParams } from "react-router-dom";
import EditTaskForm from "../../features/Task/EditTaskForm";
import validateProjectOwner from "../../services/validateProjectOwner";
import { useEffect, useState } from "react";
import type { TaskData } from "../../services/modelInterfaces";
import validateTaskAddress from "../../services/validateTaskAddress";

export default function EditTaskPage() {
  const [pageError, setPageError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [taskData, setTaskData] = useState<TaskData>();
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();
  if (!projectId) {
    return (
      <div>
        <p className='error-text'>No project ID given!</p>
      </div>
    );
  }
  if (!taskId) {
    return (
      <div>
        <p className='error-text'>No task ID given!</p>
      </div>
    );
  }

  const verifyOwner = async () => {
    try {
      await validateProjectOwner({ projectId });
    } catch (err) {
      console.error('Failed to load task creator:', err)
      setPageError('Invalid request. Check console');
    }
  };

  const fetchTask = async () => {
    try {
      const response = await validateTaskAddress({ taskId, projectId, getResponse: true })
      const { title, description, assignedName, priority, status } = response?.data.data || response?.data;
      setTaskData({
        title,
        description,
        assignedName,
        priority,
        status
      });
    } catch (err: any) {
      console.error("Error editing project:", err);
      setPageError('Failed to load project for editing. Check your console.');
    }
  }
  useEffect(() => {
    setIsLoading(true);
    verifyOwner();
    fetchTask();
    setIsLoading(false);
  }, []);

  if (isLoading || !taskData) {
    return <div style={{ padding: '15px' }}>Loading editor...</div>;
  }

  if (pageError) {
    return (
      <div>
        <p className='error-text'>{pageError}</p>
      </div>
    );
  }

  const onTaskEdited = () => {
    navigate(`/projects/${projectId}`);
  }

  return (
    <div>
      <EditTaskForm 
        onTaskEdited={onTaskEdited}
        projectId={projectId}
        taskId={taskId}
        initialData={taskData}
      />
    </div>
  );
}
