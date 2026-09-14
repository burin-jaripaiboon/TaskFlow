const Project = require('../models/Project');
const Task = require('../models/Task');
const AppError = require('../utilities/AppError')

const getProjects = async (filter, page = 1, limit = 20) => {
  const skipCount = (page - 1) * limit;

  const projects = await Project.find(filter)
    .sort({ priority: -1, createdAt: -1 })
    .skip(skipCount)
    .limit(limit);

  const totalProjects = await Project.countDocuments(filter);

  return {
    data: projects,
    metadata: {
      currentPage: Number(page),
      totalPages: Math.ceil(totalProjects / limit),
      totalProjects,
      hasMore: (page * limit) < totalProjects
    }
  };
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
