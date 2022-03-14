import { Module } from '@nestjs/common';
import { ConfigModule } from './config/module';
import { ImagesModule } from './images/module';

@Module({
  imports: [ImagesModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
