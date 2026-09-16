const taskService = require('../services/taskService');

// GET /api/tasks
exports.getTasks = async (request, response) => {
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 20;
  const filter = request.query.projectId ? { projectId: request.query.projectId } : { assignedTo: request.user };
  const tasksPage = await taskService.getTasks(filter, page, limit);
  
  response.status(200).json({ success: true, ...tasksPage });
};

// GET /api/tasks/:id
exports.getTaskById = async (request, response) => {
  const taskId = request.params.id;
  const userId = request.user;
  const task = await taskService.getTaskById({ taskId, userId });
  
  response.status(200).json({ success: true, data: task });
};

// POST /api/tasks
exports.createTask = async (request, response) => {
    const { title, description, priority, projectId, status, assignedName } = request.body;
    const task = await taskService.createTask({
      title,
      description,
      priority,
      projectId,
      status,
      assignedName
    });

    response.status(201).json({ success: true, data: task });
};

// PUT /api/tasks/:id
exports.updateTask = async (request, response) => {
  const taskId = request.params.id;
  const userId = request.user;
  const { title, description, priority, projectId, assignedName } = request.body;

  const updatedTask = await taskService.updateTask({ taskId, userId, title, description, priority, projectId, assignedName });

  response.status(200).json({ success: true, data: updatedTask });
};

// DELETE /api/tasks/:id
exports.deleteTask = async (request, response) => {
  const taskId = request.params.id;
  const userId = request.user;
  await taskService.deleteTask({ taskId, userId });
  response.status(200).json({ success: true, message: "Task successfully deleted." });
}
