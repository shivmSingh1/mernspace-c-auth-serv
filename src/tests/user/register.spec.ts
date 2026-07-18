import request from 'supertest';
import app from '../../app';
import { User } from '../../entities/User';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Roles } from '../../constants';
// import { truncateTables } from '../utils';

describe('POST /auth/register', () => {
    describe('given all fields', () => {
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

        it('should return 201 status code', async () => {
            //follow AAA
            //Arrange
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: 'shivam@gmail.com',
                password: 'secret',
            };
            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            //Asert
            expect(response.statusCode).toBe(201);
        });

        it('should return a valid JSON', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: 'shivam@gmail.com',
                password: 'secret',
            };
            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            );
        });

        it('should persist the user in database.', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: 'shivam@gmail.com',
                password: 'secret',
            };
            await request(app).post('/auth/register').send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
        });

        it('should return the id of newly created user.', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: 'shivam@gmail.com',
                password: 'secret',
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            expect(response.body).toHaveProperty('id');
        });

        it('should assign a customer role', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: 'shivam@gmail.com',
                password: 'secret',
            };
            await request(app).post('/auth/register').send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty('role');
            expect(users[0]?.role).toBe(Roles.CUSTOMER);
        });

        it('should return hashed password', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: 'shivam@gmail.com',
                password: 'secret',
            };
            await request(app).post('/auth/register').send(userData);
            const userRepository = connection.getRepository(User);

            const user = await userRepository.find();
            expect(user[0]?.password).not.toBe(userData.password);
            expect(user[0]?.password).toHaveLength(60);
        });
    });

    describe('fields are missing', () => {});
});
