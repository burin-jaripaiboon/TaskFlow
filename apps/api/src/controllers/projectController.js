const Project = require('../models/Project');
const Task = require('../models/Task');
const projectService = require('../services/projectService');

// GET /api/projects
exports.getProjects = async (request, response) => {
  const userId = request.user;
  const projects = projectService.getProjects({ ownerId: userId });
  response.status(200).json({ success: true, count: projects.length, data: projects });
};

// GET /api/projects/:id
exports.getProjectById = async (request, response) => {
  const projectId = request.params.id;
  const userId = request.user;

  const project = await projectService.getProjectById(projectId, userId);

  response.status(200).json({ success: true, data: project });
};

// POST /api/projects
exports.createProject = async (request, response) => {
  const { title, description, isPublicAccess } = request.body;
  const ownerId = request.user;

  const project = await projectService.createProject({
    title,
    description,
    isPublicAccess,
    ownerId
  });

  response.status(201).json({ success: true, data: project });
};

// PUT /api/projects/:id
exports.updateProject = async (request, response) => {
  const projectId = request.params.id;
  const updateData = request.body;
  const ownerId = request.user;

  const project = await projectService.updateProject(projectId, ownerId, updateData);
 
  response.status(200).json({ success: true, data: project });
};

// DELETE /api/projects/:id
exports.deleteProject = async (request, response) => {
  const projectId = request.params.id;
  const ownerId = request.user;

  const deletedTasks = await projectService.deleteProject(projectId, ownerId);

  response.status(200).json({ 
    success: true, 
    message: "Project and related tasks successfully deleted.",
    tasksDeleted: deletedTasks.deletedCount
  });
};
