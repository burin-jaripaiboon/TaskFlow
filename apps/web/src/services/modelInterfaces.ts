export interface Project extends ProjectData {
  _id: string;
  ownerId: string;
}
export interface ProjectData {
  title: string;
  description: string;
  isPublicAccess: boolean;
}
export interface Task extends TaskData {
  _id: string;
  projectId: string;
}
export interface TaskData {
  title: string;
  description: string;
  priority: number;
  status: taskStatusType;
  assignedName: string;
}
export type taskStatusType = typeof taskStatus[keyof typeof taskStatus];
const taskStatus = {
  TO_DO: 'TO_DO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const
