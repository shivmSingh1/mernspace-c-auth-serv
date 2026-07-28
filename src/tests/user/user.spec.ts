import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import request from 'supertest';
import app from '../../app';

describe('GET /auth/self', () => {
    let connection: DataSource;

    beforeAll(async () => {
        try {
            console.log('Initializing DB...');
            connection = await AppDataSource.initialize();
            console.log('DB Connected');
        } catch (err) {
            console.error('DB Error:', err);
            throw err;
        }
    }, 30000);

    beforeEach(async () => {
        // await truncateTables(connection);
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('given all fields', () => {
        it('should return 200 status code', async () => {
            const response = await request(app).get('/auth/self').send();
            expect(response.statusCode).toBe(200);
        });
    });
});
