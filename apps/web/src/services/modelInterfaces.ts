export interface Project extends ProjectData {
  _id: string;
  ownerId: string;
}
export interface ProjectData {
  title: string;
  description: string;
  isPublicAccess: boolean;
}
