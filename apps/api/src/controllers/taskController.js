const Task = require('../models/Task');
const User = require('../models/User');

// GET /api/tasks
exports.getTasks = async (request, response) => {
  try {
    const filter = request.query.projectId ? { projectId: request.query.projectId } : { $or: [
      { assignedBy: request.user },
      { assignedTo: request.user }
    ] };
    
    const tasks = await Task.find(filter)
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email');
    
    response.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    response.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST /api/tasks
exports.createTask = async (request, response) => {
  try {
    const { title, description, projectId, assignedName } = request.body;
    const assignedBy = request.user;
    const assignedTo = assignedName ? await User.findOne({ name: assignedName }) : null;

    if (!title || !projectId) {
      return response.status(400).json({ success: false, message: "Please provide a title and projectId." });
    }

    if (assignedName && !assignedTo) {
      return response.status(400).json({ success: false, message: "Assigned user not found." });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedBy,
      assignedTo
    });

    response.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error("Error creating task:", error);
    response.status(500).json({ success: false, message: "Server Error" });
  }
};