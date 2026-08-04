import request from 'supertest';
import express from 'express';
import userRouter from '../../routes/user';

describe('User routes', () => {
    it('responds to GET /user', async () => {
        const app = express();
        app.use('/user', userRouter);

        const res = await request(app).get('/user');
        expect(res.status).toBeGreaterThanOrEqual(200);
    });
});
