import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createConnection } from 'typeorm';

import { AppModule } from './app.module';
import { getConfig } from './config'
import { activeMigrations } from './migrations';


const initSwagger = (app: INestApplication, config) => {
  const swaggerConf = new DocumentBuilder().setTitle(config.swagger.title).setDescription(config.swagger.description).setVersion(config.swagger.version).build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConf);
  SwaggerModule.setup('api/docs/', app, swaggerDocument);
}

const runMigrations = async (config) => {
  const connection = await createConnection({name: "migrations", type: 'postgres', url: config.postgresUrl, logging: true, migrations: activeMigrations});
  await connection.runMigrations();
  await connection.close();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule), config = getConfig();
  // TODO: separate this activity
  await runMigrations(config)
  initSwagger(app, config);
  await app.listen(config.listenPort, '0.0.0.0');
}

bootstrap();
