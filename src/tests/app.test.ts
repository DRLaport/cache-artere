import request from 'supertest';
import app from '../app';

describe('Cache API', () => {
  it('successfully store a cache entry', async () => {
    const response = await request(app)
      .post('/cache')
      .send({ key: 'test', value: 'value', ttl: 1 });
    expect(response.statusCode).toBe(201);
  });

  it('retrieve a stored cache entry', async () => {
    await request(app)
      .post('/cache')
      .send({ key: 'test', value: 'value', ttl: 1 });
    const response = await request(app)
      .get('/cache/test');
    expect(response.statusCode).toBe(200);
    expect(response.body.value).toBe('value');
  });

  it('delete a cache entry', async () => {
    await request(app)
      .post('/cache')
      .send({ key: 'test', value: 'value', ttl: 1 });
    const response = await request(app)
      .delete('/cache/test');
    expect(response.statusCode).toBe(200);
  });

  it('return 404 for an expired cache entry', (done) => {
    request(app)
      .post('/cache')
      .send({ key: 'test', value: 'value', ttl: 1 })
      .then(() => {
        setTimeout(() => {
          request(app)
            .get('/cache/test')
            .then((response: request.Response) => {
              expect(response.statusCode).toBe(404);
              done();
            })
            .catch((err: any) => done(err));
        }, 1500);
      });
  });

  it('return 400 for missing required fields', async () => {
    const response = await request(app)
      .post('/cache')
      .send({ key: 'test' });
    expect(response.statusCode).toBe(400);
  });
});
