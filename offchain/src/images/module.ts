import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/module';
import { imageProviders, uploadLogProviders } from './providers';
import { ImageService, LogService } from './service';
import { ImageController } from './controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ImageController],
  providers: [
      ...imageProviders, ImageService, ...uploadLogProviders, LogService
  ]
})
export class ImagesModule {}