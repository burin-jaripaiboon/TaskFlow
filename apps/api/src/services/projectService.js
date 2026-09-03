const Project = require('../models/Project');
const Task = require('../models/Task');
const AppError = require('../utilities/AppError')

const getPublicProjects = async () => {
  return await Project.find({ isPublicAccess : true });
}

const getProjects = async (filter) => {
  return await Project.find(filter);
}

const getProjectById = async (projectId, userId) => {

  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (project.isPublicAccess) {
    return project;
  }

  const isProjectOwner = project.ownerId.toString() === userId.toString();
  const isContributor = await Task.exists({ projectId , assignedTo : userId });

  if (!isProjectOwner && !isContributor) {
    throw new AppError('You do not have permission to view this project', 403);
  }
  
  return project;
};

const createProject = async (projectData) => {

  if (!projectData.title) {
    throw new AppError('Please provide a project title.', 400);
  }

  return await Project.create(projectData);
  
}

const updateProject = async (projectId, ownerId, updateData) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  const isProjectOwner = project.ownerId.toString() === ownerId.toString();
  if (!isProjectOwner) {
    throw new AppError('Unauthorized Change.', 401);
  }

  if (updateData.title !== undefined) project.title = updateData.title;
  if (updateData.description !== undefined) project.description = updateData.description;
  if (updateData.isPublicAccess !== undefined) project.isPublicAccess = updateData.isPublicAccess;

  return await project.save();
}

const deleteProject = async (projectId, ownerId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  const isProjectOwner = project.ownerId.toString() === ownerId.toString();
  if (!isProjectOwner) {
    throw new AppError('Forbidden Change.', 403);
  }

  await project.deleteOne();
  return await Task.deleteMany({ projectId: projectId })
}

module.exports = {
  getPublicProjects,
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
