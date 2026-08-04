import type { NextFunction, Response } from 'express';
import createHttpError from 'http-errors';
import { Logger } from 'winston';
import { TenantController } from '../../controllers/TenantController';
import { TenantService } from '../../services/TenantService';
import type { ITenantRequest } from '../../types';

type MockResponse = Pick<Response, 'status' | 'json'> & {
    status: jest.MockedFunction<Response['status']>;
    json: jest.MockedFunction<Response['json']>;
};

describe('TenantController', () => {
    let controller: TenantController;
    let service: {
        create: jest.Mock;
        getAll: jest.Mock;
        update: jest.Mock;
        getById: jest.Mock;
        deleteById: jest.Mock;
    };
    let logger: Pick<Logger, 'info' | 'debug'>;
    let res: MockResponse;
    let next: NextFunction;

    beforeEach(() => {
        service = {
            create: jest.fn(() => Promise.resolve({ id: 7 })),
            getAll: jest.fn(() => Promise.resolve([[{ id: 1 }], 1])),
            update: jest.fn(() => Promise.resolve({ affected: 1 })),
            getById: jest.fn(() => Promise.resolve({ id: 2 })),
            deleteById: jest.fn(() => Promise.resolve({ affected: 1 })),
        };

        logger = {
            info: jest.fn(),
            debug: jest.fn(),
        };

        controller = new TenantController(
            service as unknown as TenantService,
            logger as unknown as Logger,
        );
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    it('creates a tenant and returns 201', async () => {
        const req = {
            body: { name: 'Acme', address: 'NY' },
        } as unknown as ITenantRequest;

        await controller.create(req, res as unknown as Response, next);

        expect(service.create).toHaveBeenCalledWith({
            name: 'Acme',
            address: 'NY',
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 7 });
    });

    it('returns paginated tenants from getAll', async () => {
        const req = {
            query: { currentPage: '1', perPage: '10' },
        } as unknown as Parameters<TenantController['getAll']>[0];

        await controller.getAll(req, res as unknown as Response, next);

        expect(service.getAll).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });

    it('passes invalid tenant ids to next', async () => {
        const req = {
            params: { id: 'abc' },
            body: { name: 'A', address: 'B' },
        } as unknown as Parameters<TenantController['update']>[0];

        await controller.update(req, res as unknown as Response, next);

        expect(next).toHaveBeenCalledWith(
            createHttpError(400, 'Invalid url param.'),
        );
    });

    it('returns 400 when a tenant does not exist', async () => {
        service.getById.mockResolvedValueOnce(null);
        const req = { params: { id: '2' } } as unknown as Parameters<
            TenantController['getOne']
        >[0];

        await controller.getOne(req, res as unknown as Response, next);

        expect(next).toHaveBeenCalledWith(
            createHttpError(400, 'Tenant does not exist.'),
        );
    });

    it('deletes a tenant by id', async () => {
        const req = { params: { id: '2' } } as unknown as Parameters<
            TenantController['destroy']
        >[0];

        await controller.destroy(req, res as unknown as Response, next);

        expect(service.deleteById).toHaveBeenCalledWith(2);
        expect(res.json).toHaveBeenCalledWith({ id: 2 });
    });
});
