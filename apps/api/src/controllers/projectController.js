const Project = require('../models/Project');

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