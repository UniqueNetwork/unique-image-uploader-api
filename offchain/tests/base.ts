import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { getConfig } from '../src/config';
import { AppModule } from '../src/app.module';

const testConfigFactory = (extra?) => () => {
  let config = getConfig();
  config.ipfsUrl = config.testingIpfsUrl;
  config = {...config, ...(extra || {})}
  return config;
};


export const initApp = async (config?): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule]
  }).overrideProvider('CONFIG').useFactory({factory: testConfigFactory(config)}).compile();

  return moduleFixture.createNestApplication();
}
