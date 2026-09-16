const Task = require('../models/Task');
const User = require('../models/User');
const AppError = require('../utilities/AppError');

const getTasks = async (filter, page = 1, limit = 20) => {
  const skipCount = (page - 1) * limit;

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email')
    .populate('projectId', 'title description')
    .sort({ priority: -1, createdAt: -1 })
    .skip(skipCount)
    .limit(limit);

  const totalTasks = await Task.countDocuments(filter);

  return {
    data: tasks,
    metadata: {
      currentPage: Number(page),
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
      hasMore: (page * limit) < totalTasks
    }
  };
}

const getTaskById = async ({ taskId, userId }) => {

  const task = await Project.findById(taskId)
                            .populate('projectId');

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.projectId.isPublicAccess) {
    return task;
  }

  const isProjectOwner = task.projectId.ownerId.toString() === userId.toString();
  const isContributor = task.assignedTo.toString() === userId.toString();

  if (!isProjectOwner && !isContributor) {
    throw new AppError('You do not have permission to edit this task', 403);
  }
  
  return project;
};


const createTask = async ({ title, description, status, priority, projectId, assignedName }) => {
  if (!title || !projectId) {
    return response.status(400).json({ success: false, message: "Please provide a title and projectId." });
  }
  
  const assignedTo = assignedName? await User.findOne({ name: assignedName }) : null;
  if (assignedName && !assignedTo) {
    throw new AppError('Assigned user not found', 400);
  }

  return await Task.create({
    title,
    description,
    status,
    priority,
    projectId,
    assignedTo
  });
}

const updateTask = async ({ taskId, userId, title, description, status, priority, assignedName }) => {
  const task = await Task.findById(taskId).populate('projectId');
  const assignedTo = assignedName? await User.findOne({ name: assignedName }) : null;

  if (assignedName && !assignedTo) {
    throw new AppError('Assigned user not found', 400);
  }
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const isProjectOwner = task.projectId.ownerId.toString() === userId.toString();
  const isAssignee = task.assignedTo && task.assignedTo.toString() === userId.toString();

  if (!isProjectOwner && !isAssignee) {
    throw new AppError('You do not have permission to edit this task', 403);
  }

  if (isProjectOwner) {
    if (title) task.title = updateData.title;
    if (description !== undefined) task.description = updateData.description;
    if (status) task.status = updateData.status;
    if (priority !== undefined) task.priority = updateData.priority;
    if (assignedTo !== undefined) task.assignedTo = updateData.assignedTo;

  } else if (isAssignee) {
    if (status) {
      task.status = status;
    }
  }

  await task.save();
  return task;
};

const deleteTask = async ({ taskId, ownerId }) => {
  const task = await Task.findById(taskId).populate('projectId');
  
  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  const isProjectOwner = task.projectId.ownerId.toString() === ownerId.toString(); 

  if (!isProjectOwner) {
    throw new AppError('Forbidden: Only the project owner can delete tasks.', 403);
  }

  await task.deleteOne();
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
