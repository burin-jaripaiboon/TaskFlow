const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/index');
const bcrypt = require('bcryptjs');
const { connect, clearDatabase, closeDatabase } = require('./testDatabase');

const User = require('../src/models/User');
const Project = require('../src/models/Project');

process.env.JWT_SECRET = 'test_secret_key';

let token;
let testProject;

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('POST /api/tasks', () => {
  
  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('Password123!', salt);
    
    const user = await User.create({
      name: 'testuser',
      email: 'test@example.com',
      password_hash
    });

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    testProject = await Project.create({
      title: 'Test Project',
      ownerId: user._id,
    });
  });

  it('should successfully create a task when provided valid data', async () => {
    const taskData = {
      title: 'Write automated tests',
      projectId: testProject._id,
      status: 'TODO'
    };

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(taskData);

    expect(response.statusCode).toBe(201);
    expect(response.body.data.title).toBe('Write automated tests');
    expect(response.body.data.status).toBe('TODO');
    
    expect(response.body._id).toBeDefined();
  });

  it('should reject the request if the JWT token is missing', async () => {
    const taskData = {
      title: 'Hacker task',
      projectId: testProject._id,
    };

    const response = await request(app)
      .post('/api/tasks')
      .send(taskData);

    expect(response.statusCode).toBe(401);
  });
});
