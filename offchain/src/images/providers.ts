import { Connection } from 'typeorm';
import { Image, UploadLog } from './entity';

export const imageProviders = [
  {
    provide: 'IMAGE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Image),
    inject: ['DATABASE_CONNECTION'],
  },
];

export const uploadLogProviders = [
  {
    provide: 'UPLOAD_LOG_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(UploadLog),
    inject: ['DATABASE_CONNECTION'],
  },
];
