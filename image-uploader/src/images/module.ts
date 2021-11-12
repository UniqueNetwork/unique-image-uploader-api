import { Module } from '@nestjs/common';
import { ImageService } from './service';
import { ImageController } from './controller';
import { ConfigModule } from '../config/module';

@Module({
  imports: [ConfigModule],
  controllers: [ImageController],
  providers: [ImageService]
})
export class ImagesModule {}