const express = require('express');
const router = express.Router();

const { getProjects, createProject, updateProject, deleteProject, getProjectById } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validateObjectId');

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(validateObjectId, protect, getProjectById)
  .put(validateObjectId, protect, updateProject)
  .delete(validateObjectId, protect, deleteProject);

module.exports = router;
