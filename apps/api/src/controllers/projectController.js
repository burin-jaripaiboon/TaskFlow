const Project = require('../models/Project');
const Task = require('../models/Task');
const projectService = require('../services/projectService');

// GET /api/projects
exports.getProjects = async (request, response) => {
  try {
    const filter = { ownerId: request.user };
    const projects = await Project.find(filter);

    response.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    response.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET /api/projects/:id
exports.getProjectById = async (request, response) => {
  try {
    const projectId = request.params.id;
    const userId = request.user;

    const project = await projectService.getProjectById(projectId, userId);

    response.status(200).json({ success: true, data: project });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    response.status(statusCode).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// POST /api/projects
exports.createProject = async (request, response) => {
  try {
    const { title, description, isPublicAccess } = request.body;
    const ownerId = request.user;

    if (!title) {
      return response.status(400).json({ success: false, message: "Please provide a project title." });
    }

    const project = await Project.create({
      title,
      description,
      ownerId,
      isPublicAccess
    });

    response.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error("Error creating project:", error);
    response.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT /api/projects/:id
exports.updateProject = async (request, response) => {
  try {
    const projectId = request.params.id;
    const { title, description, isPublicAccess } = request.body;
    const ownerId = request.user;

    const project = await Project.findOneAndUpdate(
      { _id: projectId, ownerId: ownerId }, 
      { title, description, isPublicAccess },
      { new: true, runValidators: true }
    );

    if (!project) {
      return response.status(404).json({ success: false, message: "Project not found or unauthorized access." });
    }

    response.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Error updating project:", error);
    response.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE /api/projects/:id
exports.deleteProject = async (request, response) => {
  try {
    const projectId = request.params.id;
    const ownerId = request.user;

    const project = await Project.findOneAndDelete({ _id: projectId, ownerId: ownerId });

    if (!project) {
      return response.status(404).json({ success: false, message: "Project not found or unauthorized access." });
    }

    const deletedTasks = await Task.deleteMany({ projectId: projectId });

    response.status(200).json({ 
      success: true, 
      message: "Project and related tasks successfully deleted.",
      tasksDeleted: deletedTasks.deletedCount
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    response.status(500).json({ success: false, message: "Server Error" });
  }
};
