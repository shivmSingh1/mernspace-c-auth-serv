// import { getEnv } from '../../config';

import { getEnv } from '../../config';

describe('getEnv', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        process.env = { ...OLD_ENV };
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    it('returns default PORT', () => {
        delete process.env.PORT;

        expect(getEnv('PORT')).toBe('5000');
    });

    it('returns default NODE_ENV', () => {
        delete process.env.NODE_ENV;

        expect(getEnv('NODE_ENV')).toBe('dev');
    });

    it('returns default DB_PORT', () => {
        delete process.env.DB_PORT;

        expect(getEnv('DB_PORT')).toBe('5432');
    });

    it('returns default DB_SSL', () => {
        delete process.env.DB_SSL;

        expect(getEnv('DB_SSL')).toBe('false');
    });

    it('returns default refresh token secret', () => {
        delete process.env.REFRESH_TOKEN_SECRET;

        expect(getEnv('REFRESH_TOKEN_SECRET')).toBe('dev-refresh-secret');
    });

    it('returns localhost for DB_HOST in test env', () => {
        process.env.NODE_ENV = 'test';
        delete process.env.DB_HOST;

        expect(getEnv('DB_HOST')).toBe('localhost');
    });

    it('returns env value if present', () => {
        process.env.PORT = '8080';

        expect(getEnv('PORT')).toBe('8080');
    });

    it('returns fallback env value', () => {
        delete process.env.DB_HOST;
        process.env.SUPABASE_DB_HOST = 'supabase-host';

        expect(getEnv('DB_HOST', 'SUPABASE_DB_HOST')).toBe('supabase-host');
    });

    it('returns empty string for PRIVATE_KEY', () => {
        delete process.env.PRIVATE_KEY;

        expect(getEnv('PRIVATE_KEY')).toBe('');
    });

    it('returns empty string for JWKS_URI', () => {
        delete process.env.JWKS_URI;

        expect(getEnv('JWKS_URI')).toBe('');
    });
});
