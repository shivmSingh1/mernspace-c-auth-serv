import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Config } from './index';
// import { Config } from "./index"

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    //turn off synchronization in prod
    synchronize: Config.NODE_ENV === 'test' || Config.NODE_ENV === 'dev',
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
