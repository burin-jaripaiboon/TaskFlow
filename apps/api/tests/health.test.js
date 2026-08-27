const request = require('supertest');
const app = require('../src/index'); 

jest.mock('../src/config/db', () => jest.fn());

describe('Health Check API', () => {
  it('should return a 200 OK status and a success message', async () => {
    const response = await request(app).get('/api/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.message).toBe('TaskFlow API is healthy');
  });
});
