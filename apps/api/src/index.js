require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Config
const connectDB = require('./config/databaseConfig');

// Routes
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Health Check Endpoint
app.get('/api/health', (request, response) => {
  const dbState = mongoose.connection.readyState;
  const statuses = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  response.status(200).json({
    api: 'TaskFlow API is running',
    database: statuses[dbState] || 'Unknown',
    timestamp: new Date()
  });
});

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
