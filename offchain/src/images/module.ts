import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/module';
import { imageProviders, uploadLogProviders } from './providers';
import { ImageService, LogService } from './service';
import { ImageController } from './controller';
import { ConfigModule } from '../config/module';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [ImageController],
  providers: [
      ...imageProviders, ImageService, ...uploadLogProviders, LogService
  ]
})
export class ImagesModule {}