import { useNavigate } from 'react-router-dom';
import ProjectCreationForm from '../features/ProjectCreationForm';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const onProjectCreated = () => {
    navigate('/projects')
  }

  return (
    <div>
      <ProjectCreationForm onProjectCreated={onProjectCreated}/>
    </div>
  );
}
