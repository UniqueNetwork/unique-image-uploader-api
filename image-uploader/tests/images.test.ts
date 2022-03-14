import { join } from 'path'

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { initApp } from './base';
import * as constants from '../src/constants';

describe('Images service', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initApp();
    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  it('/api/images/upload/ (POST, bad request, no file)', async () => {
    const response = await request(app.getHttpServer()).post('/api/images/upload/');
    await expect(response.statusCode).toBe(400);
    await expect(response.body).toEqual({success: false, error: constants.dataErrors.ERR_INVALID_PAYLOAD});
  });
  it('/api/images/upload/ (POST, invalid image)', async () => {
    const config = app.get('CONFIG');
    const response = await request(app.getHttpServer()).post('/api/images/upload/').attach('file', join(config.projectDir, '..', 'tests', 'jest.config.json'));
    await expect(response.statusCode).toBe(400);
    await expect(response.body).toEqual({success: false, error: constants.fileErrors.ERR_INVALID_FILE_TYPE});
  });
  it('/api/images/upload/ (POST, valid image)', async () => {
    const config = app.get('CONFIG');
    const response = await request(app.getHttpServer()).post('/api/images/upload/').attach('file', join(config.projectDir, '..', 'tests', 'data', 'punk.png'));

    await expect(response.statusCode).toBe(201);
    await expect(response.body).toEqual({
      'success': true, 'address': 'QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb'
    });
  });
});
