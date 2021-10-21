import { createConnection } from 'typeorm';
import { getConfig } from '../config';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async () => {
            const config = getConfig();
            return await createConnection({
                type: 'postgres',
                url: config.postgresUrl,
                entities: [
                    __dirname + '/../**/entity{.ts,.js}',
                ],
                synchronize: false
            })
        },
    },
];