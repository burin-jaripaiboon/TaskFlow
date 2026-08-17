const express = require('express');
const router = express.Router();

// Import the controller functions
const { getTasks, createTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Map the routes to the controller methods
router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

// If we had endpoints for specific IDs, we would add them like this:
// router.route('/:id')
//   .put(protect, updateTask)
//   .delete(protect, deleteTask);

module.exports = router;