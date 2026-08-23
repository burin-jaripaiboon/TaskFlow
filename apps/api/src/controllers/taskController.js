const Task = require('../models/Task');
const User = require('../models/User');
const taskService = require('../services/taskService');

// GET /api/tasks
exports.getTasks = async (request, response) => {
  try {
    const filter = request.query.projectId ? { projectId: request.query.projectId } : { assignedTo: request.user };
    
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title description');
    
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
      assignedTo
    });

    response.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error("Error creating task:", error);
    response.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (request, response) => {
  try {
    const taskId = request.params.id;
    const userId = request.user; // Assuming your auth middleware puts the ID here
    const updateData = request.body;

    // Hand the raw data off to the brain!
    const updatedTask = await taskService.updateTask(taskId, userId, updateData);

    // If the service succeeds, send the success response
    response.status(200).json({ success: true, data: updatedTask });

  } catch (error) {
    // If the service throws our AppError, use its status code (403, 404, etc.)
    // Otherwise, default to a 500 Server Error
    const statusCode = error.statusCode || 500;
    response.status(statusCode).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

exports.deleteTask = async (request, response) => {
  try {
    const { id } = request.params;
    const { projectId } = request.body;
    const userId = request.user;

    const task = await Task.findById(taskId).populate('projectId');
    
    if (!task) {
      return response.status(404).json({ success: false, message: "Task not found." });
    }

    const isProjectOwner = task.projectId.ownerId.toString() === userId.toString(); 

    if (!isProjectOwner) {
      return response.status(403).json({ success: false, message: "Unauthorized: Only the project owner can delete tasks." });
    }

    await task.deleteOne();
    return task;

  } catch (error) {
    console.error("Error deleting task:", error);
    response.status(500).json({ success: false, message: "Server Error" });
  }
}