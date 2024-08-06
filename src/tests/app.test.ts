import request from 'supertest';
import app from '../app';

describe('Cache API', () => {
  // Test setting a cache value
  it('should set a cache value', async () => {
    const response = await request(app)
      .post('/cache')
      .send({ key: 'test', value: 'value', ttl: 1 });
    expect(response.statusCode).toBe(201);
  });

  // Test retrieving a stored cache value
  it('should retrieve a stored cache value', async () => {
    await request(app)
      .post('/cache')
      .send({ key: 'test', value: 'value', ttl: 1 });
    
    const response = await request(app)
      .get('/cache/test');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.value).toBe('value');
  });

  // Test deleting a cache value
  it('should delete a cache value', async () => {
    await request(app)
      .post('/cache')
      .send({ key: 'test', value: 'value', ttl: 1 });
    
    const response = await request(app)
      .delete('/cache/test');
    
    expect(response.statusCode).toBe(200);
  });

  // Test that an expired cache value returns 404
  it('should return 404 for expired cache value', async () => {
    jest.useFakeTimers(); // Use fake timers to control time
    
    await request(app)
      .post('/cache')
      .send({ key: 'test', value: 'value', ttl: 1 });
    
    jest.advanceTimersByTime(1500); // Advance time to simulate TTL expiration
    
    const response = await request(app).get('/cache/test');
    
    expect(response.statusCode).toBe(404);
  });

  // Test missing required fields returns 400
  it('should return 400 for missing required fields', async () => {
    const response = await request(app)
      .post('/cache')
      .send({ key: 'test' });
    
    expect(response.statusCode).toBe(400);
  });

  // Test retrieving cache statistics
  it('should return cache stats', async () => {
    const response = await request(app).get('/cache/stats');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('hits');
    expect(response.body).toHaveProperty('misses');
    expect(response.body).toHaveProperty('size');
  });


  it('should handle retrieving a non-existent key', async () => {
    const response = await request(app).get('/cache/nonExistentKey');
    
    expect(response.statusCode).toBe(404);
  });

});
