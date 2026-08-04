import dotenv from 'dotenv';
import path from 'node:path';
dotenv.config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
});

export function getEnv(name: string, fallbackName?: string): string {
    const value =
        process.env[name] || (fallbackName ? process.env[fallbackName] : '');

    if (!value) {
        if (name === 'PORT') {
            return '5000';
        }

        if (name === 'NODE_ENV') {
            return 'dev';
        }

        if (name === 'DB_PORT') {
            return '5432';
        }

        if (name === 'DB_SSL') {
            return 'false';
        }

        if (name === 'REFRESH_TOKEN_SECRET') {
            return 'dev-refresh-secret';
        }

        if (name === 'JWKS_URI') {
            return '';
        }

        if (name === 'PRIVATE_KEY') {
            return '';
        }

        if (
            name === 'DB_HOST' ||
            name === 'DB_USERNAME' ||
            name === 'DB_PASSWORD' ||
            name === 'DB_NAME'
        ) {
            return process.env.NODE_ENV === 'test' ? 'localhost' : '';
        }
    }

    return value ?? '';
}

export const Config = {
    PORT: getEnv('PORT'),
    NODE_ENV: getEnv('NODE_ENV'),
    DB_HOST: getEnv('DB_HOST', 'SUPABASE_DB_HOST'),
    DB_PORT: getEnv('DB_PORT', 'SUPABASE_DB_PORT'),
    DB_USERNAME: getEnv('DB_USERNAME', 'SUPABASE_DB_USERNAME'),
    DB_PASSWORD: getEnv('DB_PASSWORD', 'SUPABASE_DB_PASSWORD'),
    DB_NAME: getEnv('DB_NAME', 'SUPABASE_DB_NAME'),
    DB_SSL: getEnv('DB_SSL', 'SUPABASE_DB_SSL'),
    DATABASE_URL: getEnv('DATABASE_URL', 'SUPABASE_DATABASE_URL'),
    REFRESH_TOKEN_SECRET: getEnv('REFRESH_TOKEN_SECRET'),
    JWKS_URI: getEnv('JWKS_URI'),
    // CLIENT_UI_DOMAIN: getEnv('CLIENT_UI_DOMAIN'),
    // ADMIN_UI_DOMAIN: getEnv('ADMIN_UI_DOMAIN'),
    // MAIN_DOMAIN: getEnv('MAIN_DOMAIN'),
    PRIVATE_KEY: getEnv('PRIVATE_KEY'),
};
