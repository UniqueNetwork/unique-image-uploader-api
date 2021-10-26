import { createConnection } from 'typeorm';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async (config) => {
            return await createConnection({
                type: 'postgres',
                url: config.postgresUrl,
                entities: [
                    __dirname + '/../**/entity{.ts,.js}',
                ],
                synchronize: false
            })
        },
      inject: ['CONFIG']
    },
];