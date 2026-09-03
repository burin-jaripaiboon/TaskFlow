require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();



// Middleware
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utilities/AppError');

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

app.all('(.*)', (req, res, next) => {
  next(new AppError(`API Error: ${req.originalUrl} doesn't exist!`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  const connectDB = require('./config/databaseConfig');
  
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to the database. Server crashed.", err);
      process.exit(1);
    });
}

module.exports = app;
