import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createConnection } from 'typeorm';

import { getConfig } from '../src/config';
import { AppModule } from '../src/app.module';
import { activeMigrations } from '../src/migrations';

const testConfigFactory = (extra?) => () => {
  let config = getConfig();
  config.postgresUrl = config.testingPostgresUrl;
  config = {...config, ...(extra || {})}
  return config;
};


export const initApp = async (config?): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule]
  }).overrideProvider('CONFIG').useFactory({factory: testConfigFactory(config)}).compile();

  return moduleFixture.createNestApplication();
}

export const getMigrationsConnection = async (config) => {
  return await createConnection({name: 'migrations', type: 'postgres', url: config.postgresUrl, logging: true, migrations: activeMigrations});
}

export const runMigrations = async (config) => {
  const connection = await getMigrationsConnection(config);
  await connection.dropDatabase();
  await connection.runMigrations();
  await connection.close();
}