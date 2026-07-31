import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Config } from './index';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    //turn off synchronization in prod
    synchronize: false,
    logging: false,
    entities: ['src/entities/*.ts'],
    migrations: ['src/migrations/*.ts'],
    subscribers: [],
});
