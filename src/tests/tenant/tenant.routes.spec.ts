import request from 'supertest';
import express from 'express';
import tenantRouter from '../../routes/tenant';

describe('Tenant routes', () => {
    it('responds to GET /tenant', async () => {
        const app = express();
        app.use('/tenant', tenantRouter);

        const res = await request(app).get('/tenant');
        expect(res.status).toBeGreaterThanOrEqual(200);
    });
});
