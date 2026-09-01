const express = require('express');
const router = express.Router();

const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validateObjectId');

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .put(validateObjectId, protect, updateTask)
  .delete(validateObjectId, protect, deleteTask);

module.exports = router;
