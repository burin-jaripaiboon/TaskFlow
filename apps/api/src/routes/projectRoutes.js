const express = require('express');
const router = express.Router();

// Import the controller functions
const { getProjects, createProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// Map the routes to the controller methods
router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

// If we had endpoints for specific IDs, we would add them like this:
// router.route('/:id')
//   .put(protect, updateProject)
//   .delete(protect, deleteProject);

module.exports = router;