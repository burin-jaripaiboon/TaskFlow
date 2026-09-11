import { useNavigate, useParams } from "react-router-dom";
import ProjectEditingForm from "../features/ProjectEditingForm";

export default function EditProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const onProjectEdited = () => {
    navigate(`/projects/${id}`);
  }
  return (
    <div>
      <ProjectEditingForm onProjectEdited={onProjectEdited} />
    </div>
  );
}
