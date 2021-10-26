import { Module } from '@nestjs/common';
import { ConfigModule } from './config/module';
import { DatabaseModule} from './database/module';
import { ImagesModule } from './images/module';

@Module({
  imports: [DatabaseModule, ImagesModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
