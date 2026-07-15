import request from 'supertest';
import app from '../../app';

describe('POST /auth/register', () => {
    describe('given all fields', () => {
        it('should return 201 status code', async () => {
            //follow AAA
            //Arrange
            const userData = {
                firstname: 'shivam',
                lastname: 'singh',
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
    });

    describe('fields are missing', () => {});
});
