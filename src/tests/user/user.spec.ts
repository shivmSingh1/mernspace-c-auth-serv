import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import request from 'supertest';
import app from '../../app';
import createJWKSMock from 'mock-jwks';
import { Roles } from '../../constants';

describe('GET /auth/self', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        try {
            jwks = createJWKSMock('http://localhost:5000');
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
            // const response = await request(app).get('/auth/self').send();

            const accessToken = jwks.token({
                sub: String('1'),
                role: Roles.CUSTOMER,
            });

            console.log('accessToken', accessToken);

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send();

            expect(response.statusCode).toBe(200);
        });

        it('should return the user data', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: 'shivam@gmail.com',
                password: 'secret1234',
            };
            const userRepo = connection.getRepository('User');
            const user = await userRepo.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            const accessToken = jwks.token({
                sub: String(user.id),
                role: user.role,
            });

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send();

            expect((response.body as Record<string, string>).id).toBe(user.id);
        });
    });
});
