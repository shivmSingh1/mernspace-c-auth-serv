import request from 'supertest';
import app from '../../app';
import { User } from '../../entities/User';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Roles } from '../../constants';
import { isJwt } from '../utils';
// import { truncateTables } from '../utils';

describe('POST /auth/register', () => {
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
        it('should return 201 status code', async () => {
            //follow AAA
            //Arrange
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: 'shivam@gmail.com',
                password: 'secret1234',
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
                password: 'secret1234',
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
                password: 'secret1234',
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
                password: 'secret1234',
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
                password: 'secret1234',
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
                password: 'secret1234',
            };
            await request(app).post('/auth/register').send(userData);
            const userRepository = connection.getRepository(User);

            const users = await userRepository.find();
            expect(users[0]?.password).not.toBe(userData.password);
            expect(users[0]?.password).toHaveLength(60);
        });

        it('should return 400 status code if email already exist.', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: 'shivam@gmail.com',
                password: 'secret1234',
            };

            const userRepository = connection.getRepository(User); //getting user table
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            const users = await userRepository.find(); //finding all users from table
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });

        it('should return access token and refresh token inside a cookie', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: 'shivam@gmail.com',
                password: 'secret1234',
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            const cookies = response.get('Set-Cookie');

            let accessToken: string | undefined;
            let refreshToken: string | undefined;

            cookies?.forEach((cookie: string) => {
                if (cookie.startsWith('access-token=')) {
                    accessToken = cookie?.split(';')[0]?.split('=')[1];
                }

                if (cookie.startsWith('refresh-token=')) {
                    refreshToken = cookie?.split(';')[0]?.split('=')[1];
                }
            });

            expect(accessToken).toBeDefined();
            expect(refreshToken).toBeDefined();
            // console.log("access token", accessToken)

            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });
    });

    describe('fields are missing', () => {
        it('should return 400 status code if email are missing.', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: '',
                password: 'secret1234',
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(response.statusCode).toBe(400);
        });

        it('should return 400 status code if firstName is missing', async () => {
            const userData = {
                firstName: '',
                lastName: 'singh',
                email: 'shivam@gmail.com',
                password: 'secret1234',
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(response.statusCode).toBe(400);
        });

        it('should return 400 status code if lastName is missing', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: '',
                email: 'shivam@gmail.com',
                password: 'secret1234',
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(response.statusCode).toBe(400);
        });

        it('should return 400 status code if password is missing', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: 'shivam@gmail.com',
                password: '',
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(response.statusCode).toBe(400);
        });
    });

    describe('fields are not in correct format', () => {
        it('should trim the email field', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: ' shivam@gmail.com ',
                password: 'secret1234',
            };

            await request(app).post('/auth/register').send(userData);

            const userRepository = connection.getRepository(User); //getting user table
            const users = await userRepository.find();
            const user = users[0];

            expect(user?.email).toBe('shivam@gmail.com');
        });

        it('should return 400 status code if email is not a valid email', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: 'shivamgmail.com',
                password: 'secret1234',
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(response.statusCode).toBe(400);
        });

        it('should return 400 status code if password length is less then 8 chars', async () => {
            const userData = {
                firstName: 'shivam',
                lastName: 'singh',
                email: 'shivam@gmail.com',
                password: 'secret',
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(response.statusCode).toBe(400);
        });
    });
});
