import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Config } from './index';

const connectionOptions: Record<string, unknown> = {
    type: 'postgres',
    synchronize: false,
    logging: false,
    entities: ['src/entities/*.{ts,js}'],
    migrations: ['src/migrations/*.{ts,js}'],
    subscribers: [],
};

if (Config.DATABASE_URL) {
    connectionOptions.url = Config.DATABASE_URL;
} else {
    connectionOptions.host = Config.DB_HOST;
    connectionOptions.port = Number(Config.DB_PORT);
    connectionOptions.username = Config.DB_USERNAME;
    connectionOptions.password = Config.DB_PASSWORD;
    connectionOptions.database = Config.DB_NAME;
}

if (
    Config.DB_SSL === 'true' ||
    Config.DB_HOST?.includes('supabase') ||
    Config.DATABASE_URL?.includes('supabase')
) {
    connectionOptions.ssl = { rejectUnauthorized: false };
}

export const AppDataSource = new DataSource(connectionOptions as never);
