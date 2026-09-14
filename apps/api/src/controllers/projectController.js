const projectService = require('../services/projectService');

// GET /api/projects
exports.getProjects = async (request, response) => {
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 20;
  const userId = request.user;
  const projectsPage = await projectService.getProjects({ ownerId: userId }, page, limit);
  response.status(200).json({ success: true, ...projectsPage });
};

// GET /api/projects/:id
exports.getProjectById = async (request, response) => {
  const projectId = request.params.id;
  const userId = request.user;

  const project = await projectService.getProjectById({ projectId, userId });

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
  const { title, description, isPublicAccess } = request.body;
  const ownerId = request.user;

  const project = await projectService.updateProject({ projectId, ownerId, title, description, isPublicAccess });
 
  response.status(200).json({ success: true, data: project });
};

// DELETE /api/projects/:id
exports.deleteProject = async (request, response) => {
  const projectId = request.params.id;
  const ownerId = request.user;

  const deletedTasks = await projectService.deleteProject({ projectId, ownerId });

  response.status(200).json({ 
    success: true, 
    message: "Project and related tasks successfully deleted.",
    tasksDeleted: deletedTasks.deletedCount
  });
};
