import { useNavigate, useParams } from "react-router-dom";
import EditTaskForm from "../../features/Task/EditTaskForm";

export default function EditTaskPage() {
  const { projectId } = useParams();
  const navigate = useNavigate()
  const onTaskEdited = () => {
    navigate(`/projects/${projectId}`);
  }
  return (
    <div>
      <EditTaskForm onTaskEdited={onTaskEdited} />
    </div>
  );
}
