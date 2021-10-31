import { INestApplication } from '@nestjs/common';
import { MigrationExecutor } from "typeorm";

import { initApp, getMigrationsConnection } from './base';

describe('Migrations', () => {
  let app: INestApplication;
  jest.setTimeout(60 * 1000);

  beforeAll(async () => {
    app = await initApp();
    await app.init();
  });

  it('Rollback migrations', async () => {
    const conn = await getMigrationsConnection(app.get('CONFIG'));
    await conn.dropDatabase();
    await conn.runMigrations();
    const migrationExecutor = new MigrationExecutor(conn);
    // eslint-disable-next-line
    for (let _ of await migrationExecutor.getAllMigrations()) {
      await migrationExecutor.undoLastMigration();
    }
    await conn.close();
  });
});
