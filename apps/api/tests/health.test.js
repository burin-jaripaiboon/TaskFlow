const request = require('supertest');
const app = require('../src/index'); 

jest.mock('../src/config/databaseConfig', () => jest.fn());

describe('Health Check API', () => {
  it('should return a 200 OK status and a success message', async () => {
    const response = await request(app).get('/api/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.api).toBe('TaskFlow API is running');
  });
});
