import { useNavigate } from 'react-router-dom';
import CreateProjectForm from '../../features/Project/CreateProjectForm';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const onProjectCreated = () => {
    navigate('/projects')
  }

  return (
    <div>
      <CreateProjectForm onProjectCreated={onProjectCreated}/>
    </div>
  );
}
