const Task = require('../models/Task');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

exports.updateTask = async (taskId, userId, updateData) => {
  const task = await Task.findById(taskId).populate('projectId');
  
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const isProjectOwner = task.projectId.ownerId.toString() === userId.toString();
  const isAssignee = task.assignedTo && task.assignedTo.toString() === userId.toString();

  if (!isProjectOwner && !isAssignee) {
    throw new AppError('You do not have permission to edit this task', 403);
  }

  if (isProjectOwner) {
    if (updateData.title) task.title = updateData.title;
    if (updateData.description) task.description = updateData.description;
    if (updateData.status) task.status = updateData.status;
    if (updateData.assignedTo !== undefined) task.assignedTo = updateData.assignedTo;

  } else if (isAssignee) {
    if (updateData.status) {
      task.status = updateData.status;
    }
  }

  await task.save();
  return task;
};
