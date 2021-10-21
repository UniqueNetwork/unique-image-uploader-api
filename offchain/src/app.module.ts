import { Module } from '@nestjs/common';
import { DatabaseModule} from './database/module';
import { ImagesModule } from './images/module';

@Module({
  imports: [DatabaseModule, ImagesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
