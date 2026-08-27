const Project = require('../models/Project');
const Task = require('../models/Task');


class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

exports.getProjectById = async = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (project.isPublicAccess) {
    return project;
  }

  const isProjectOwner = project.ownerId.toString() === userId.toString();
  const isContributor = await Task.find({ projectId , assignedTo : userId });

  if (!isProjectOwner && !isContributor) {
    throw new AppError('You do not have permission to view this project', 403);
  }
  
  return project;
};
