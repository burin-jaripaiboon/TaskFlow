const Task = require('../models/Task');
const taskService = require('../services/taskService');

// GET /api/tasks
exports.getTasks = async (request, response) => {
  const filter = request.query.projectId ? { projectId: request.query.projectId } : { assignedTo: request.user };
  const tasks = await taskService.getTasks(filter)
  
  response.status(200).json({ success: true, count: tasks.length, data: tasks });
};

// POST /api/tasks
exports.createTask = async (request, response) => {
    const { title, description, priority, projectId, assignedName } = request.body;
    const task = await taskService.createTask({
      title,
      description,
      priority,
      projectId,
      assignedName
    });

    response.status(201).json({ success: true, data: task });
};

// PUT /api/tasks/:id
exports.updateTask = async (request, response) => {
  const taskId = request.params.id;
  const userId = request.user;
  const updateData = request.body;

  const updatedTask = await taskService.updateTask(taskId, userId, updateData);

  response.status(200).json({ success: true, data: updatedTask });
};

// DELETE /api/tasks/:id
exports.deleteTask = async (request, response) => {
  const taskId = request.params.id;
  const userId = request.user;
  await taskService.deleteTask(taskId, userId);
  response.status(200).json({ success: true, message: "Task successfully deleted." });
}
