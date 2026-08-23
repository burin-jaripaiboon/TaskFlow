const Project = require('../models/Project');
const Task = require('../models/Task');

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

// POST /api/projects
exports.createProject = async (request, response) => {
  try {
    const { title, description } = request.body;
    const ownerId = request.user;

    if (!title) {
      return response.status(400).json({ success: false, message: "Please provide a project title." });
    }

    const project = await Project.create({
      title,
      description,
      ownerId
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
    const { id } = request.params;
    const { title, description } = request.body;
    const ownerId = request.user;

    const project = await Project.findOneAndUpdate(
      { _id: id, ownerId: ownerId }, 
      { title, description },
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
    const { id } = request.params;
    const ownerId = request.user;

    const project = await Project.findOneAndDelete({ _id: id, ownerId: ownerId });

    if (!project) {
      return response.status(404).json({ success: false, message: "Project not found or unauthorized access." });
    }

    const deletedTasks = await Task.deleteMany({ projectId: id });

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