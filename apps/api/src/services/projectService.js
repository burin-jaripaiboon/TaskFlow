const Project = require('../models/Project');
const Task = require('../models/Task');
const AppError = require('../utilities/AppError')

const getPublicProjects = async () => {
  return await Project.find({ isPublicAccess : true });
}

const getProjects = async (filter) => {
  return await Project.find(filter);
}

const getProjectById = async ({ projectId, userId }) => {

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

const createProject = async ({ title, description, isPublicAccess, ownerId }) => {

  if (!title) {
    throw new AppError('Please provide a project title.', 400);
  }

  return await Project.create({
    title,
    description,
    isPublicAccess,
    ownerId
  });
  
}

const updateProject = async ({ projectId, ownerId, title, description, isPublicAccess }) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  const isProjectOwner = project.ownerId.toString() === ownerId.toString();
  if (!isProjectOwner) {
    throw new AppError('Unauthorized Change.', 401);
  }

  if (title !== undefined || title !== '') project.title = title;
  if (description !== undefined) project.description = description;
  if (isPublicAccess !== undefined) project.isPublicAccess = isPublicAccess;

  return await project.save();
}

const deleteProject = async ({ projectId, ownerId }) => {
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
