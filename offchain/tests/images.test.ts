import { join } from 'path'
import { mkdirSync, rmdirSync } from 'fs';

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { initApp, runMigrations } from './base';
import * as constants from '../src/constants';

describe('Images service', () => {
  let app: INestApplication;
  const tmpDir = join('/tmp', `jest-test-${new Date().getTime()}`);
  jest.setTimeout(60 * 1000);

  beforeAll(async () => {
    mkdirSync(tmpDir, {recursive: true});
    app = await initApp({uploadsDir: tmpDir});
    await runMigrations(app.get('CONFIG'));
    await app.init();
  });

  afterAll(() => {
    rmdirSync(tmpDir, {recursive: true});
  });

  it('/api/images/upload/ (POST, bad request, no collection)', () => {
    const config = app.get('CONFIG');
    let response = request(app.getHttpServer()).post('/api/images/upload/');
    response = response.attach('file', join(config.projectDir, '..', 'tests', 'data', 'punk.png'));
    return response.expect(400).expect({success: false, error: constants.dataErrors.ERR_INVALID_PAYLOAD});
  });
  it('/api/images/upload/ (POST, bad request, no file)', () => {
    const response = request(app.getHttpServer()).post('/api/images/upload/').field('collection_id', 1);
    return response.expect(400).expect({success: false, error: constants.dataErrors.ERR_INVALID_PAYLOAD});
  });
  it('/api/images/upload/ (POST, invalid image)', () => {
    const config = app.get('CONFIG');
    let response = request(app.getHttpServer()).post('/api/images/upload/');
    response = response.field('collection_id', 1).attach('file', join(config.projectDir, '..', 'tests', 'jest.config.json'));
    return response.expect(400).expect({success: false, error: constants.fileErrors.ERR_INVALID_FILE_TYPE});
  });
  it('/api/images/upload/ (POST, valid image)', () => {
    const config = app.get('CONFIG');
    let response = request(app.getHttpServer()).post('/api/images/upload/');
    response = response.field('collection_id', 1).attach('file', join(config.projectDir, '..', 'tests', 'data', 'punk.png'));
    return response.expect(201).expect({success: true, hash: '16d103ce510364bcf22d6934afb5d541175f56c8ae38c7d5a8d4d48ffdf29018'});
  });
});
