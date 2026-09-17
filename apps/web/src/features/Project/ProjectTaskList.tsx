import { useEffect, useState } from "react";
import type { Task } from "../../services/modelInterfaces";
import api from "../../services/api";
import { Link } from "react-router-dom";

interface TaskListProps {
  projectId: string;
  isProjectOwner: boolean;
}

export default function ProjectTaskList({ projectId, isProjectOwner }: TaskListProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksPage, setTasksPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalTasks, setTotalTasks] = useState<number>(0);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/tasks?projectId=${projectId}&page=${tasksPage}`);
      setTasks(response.data.data);
      setTotalPages(response.data.metadata.totalPages);
      setTotalTasks(response.data.metadata.totalTasks);
    } catch (err: any) {
      console.error("Error loading tasks", err);
      setFetchError('Failed to load tasks. Check your console.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [tasksPage, projectId])

  if (isLoading && !tasks) {
    return <div>Loading related tasks...</div>;
  }

  if (fetchError) {
    return <div style={{ color: 'red' }}>{fetchError}</div>;
  }

  return (
    <div style={{ marginTop: '30px' }}>
      <div style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', display: 'flex', gap: '20px' }}>
        <h3>Project Tasks ({totalTasks})</h3> 
        { isProjectOwner && (<Link className='link-color' to={`/projects/${projectId}/tasks/create`}>+ New Task</Link>) }
      </div>
      {tasks.length === 0 ? (
        <p style={{ color: '#666', paddingTop: '10px' }}>No tasks have been created for this project yet.</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
            {tasks.map((task) => (
              <div 
                key={task._id}
                className="content-cell"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  opacity: isLoading ? 0.5 : 1,
                  transition: 'opacity 0.2s ease',
                  columnGap: '20px'
                }}
              >
                {/* Left Side: Text Content */}
                <div>
                  <strong style={{ fontSize: '16px', display: 'block', marginBottom: '5px' }}>
                    <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word', flex: '1 1 auto' }}>
                      {task.title}
                    </span>
                    {isProjectOwner && (
                      <Link 
                        style={{ marginLeft: '15px', whiteSpace: 'nowrap', flexShrink: 0 }} 
                        className='link-color' 
                        to={`/projects/${projectId}/tasks/${task._id}/edit`}
                      >
                        Edit
                      </Link>
                    )}
                  </strong>
                  <span style={{ fontSize: '14px', color: '#666', display: 'block' }}>
                    {task.description || 'No description provided.'}
                  </span>
                </div>

                {/* Right Side: Badges & Priority */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: task.status === 'DONE' ? '#d4edda' : task.status === 'IN_PROGRESS' ? '#cce5ff' : '#f8f9fa',
                    color: task.status === 'DONE' ? '#155724' : task.status === 'IN_PROGRESS' ? '#004085' : '#383d41',
                  }}>
                    {task.status.replace('_', ' ')}
                  </span>
                  
                  <span style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>
                    Priority: {task.priority ?? 0}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
              <button 
                onClick={() => setTasksPage(prev => Math.max(1, prev - 1))}
                disabled={tasksPage === 1 || isLoading}
                style={{ padding: '8px 16px', cursor: (tasksPage === 1 || isLoading) ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              
              <span style={{ fontSize: '14px', color: '#555' }}>
                Page {tasksPage} of {totalPages}
              </span>
              
              <button 
                onClick={() => setTasksPage(prev => Math.min(totalPages, prev + 1))}
                disabled={tasksPage === totalPages || isLoading}
                style={{ padding: '8px 16px', cursor: (tasksPage === totalPages || isLoading) ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
