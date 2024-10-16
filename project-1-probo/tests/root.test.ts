import app from '@/server';
import nock from 'nock';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'; // Adjust the path if necessary

// Optional: If you have any setup for your database or external services
beforeAll(async () => {
  // Example: Start your database connection or mock services
  // await database.connect();
});

afterAll(async () => {
  // Example: Stop your database connection or clean up resources
  // await database.disconnect();
});

afterEach(() => {
  nock.cleanAll(); // Clean up any mocks after each test
});

describe('api endpoints', () => {
  it('get / should return welcome message', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the API!',
    });
  });

  it('get /healthcheck should return server health information', async () => {
    const response = await request(app).get('/healthcheck');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Server is running');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('timestamp');
  });
});
