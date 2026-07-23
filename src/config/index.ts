import dotenv from 'dotenv';
import path from 'node:path';
dotenv.config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

// const { PORT, NODE_ENV, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;

function getEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is not defined`);
    }

    return value;
}

export const Config = {
    PORT: getEnv('PORT'),
    NODE_ENV: getEnv('NODE_ENV'),
    DB_HOST: getEnv('DB_HOST'),
    DB_PORT: getEnv('DB_PORT'),
    DB_USERNAME: getEnv('DB_USERNAME'),
    DB_PASSWORD: getEnv('DB_PASSWORD'),
    DB_NAME: getEnv('DB_NAME'),
    REFRESH_TOKEN_SECRET: getEnv('REFRESH_TOKEN_SECRET'),
};
