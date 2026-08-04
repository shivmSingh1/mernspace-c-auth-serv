import type { NextFunction, Response } from 'express';
import createHttpError from 'http-errors';
import { Logger } from 'winston';
import { UserController } from '../../controllers/UserController';
import { UserService } from '../../services/userService';
import type { CreateUserRequest, UpdateUserRequest } from '../../types';

type MockResponse = Pick<Response, 'status' | 'json'> & {
    status: jest.MockedFunction<Response['status']>;
    json: jest.MockedFunction<Response['json']>;
};

describe('UserController', () => {
    let controller: UserController;
    let service: {
        create: jest.Mock;
        update: jest.Mock;
        getAll: jest.Mock;
        findById: jest.Mock;
        deleteById: jest.Mock;
    };
    let logger: Pick<Logger, 'info' | 'debug'>;
    let res: MockResponse;
    let next: NextFunction;

    beforeEach(() => {
        service = {
            create: jest.fn(() => Promise.resolve({ id: 11 })),
            update: jest.fn(() => Promise.resolve({ affected: 1 })),
            getAll: jest.fn(() => Promise.resolve([[{ id: 1 }], 1])),
            findById: jest.fn(() => Promise.resolve({ id: 2 })),
            deleteById: jest.fn(() => Promise.resolve({ affected: 1 })),
        };

        logger = {
            info: jest.fn(),
            debug: jest.fn(),
        };

        controller = new UserController(
            service as unknown as UserService,
            logger as unknown as Logger,
        );
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    it('creates a user and returns 201', async () => {
        const req = {
            body: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'secret123',
                tenantId: 1,
                role: 'customer',
            },
        } as unknown as CreateUserRequest;

        await controller.create(req, res as unknown as Response, next);

        expect(service.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 11 });
    });

    it('returns paginated users from getAll', async () => {
        const req = {
            query: { currentPage: '1', perPage: '10' },
        } as unknown as Parameters<UserController['getAll']>[0];

        await controller.getAll(req, res as unknown as Response, next);

        expect(service.getAll).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });

    it('returns 400 for invalid user id on update', async () => {
        const req = {
            params: { id: 'abc' },
            body: { firstName: 'A', lastName: 'B', role: 'customer' },
        } as unknown as UpdateUserRequest;

        await controller.update(req, res as unknown as Response, next);

        expect(next).toHaveBeenCalledWith(
            createHttpError(400, 'Invalid url param.'),
        );
    });

    it('returns 400 when the user does not exist', async () => {
        service.findById.mockResolvedValueOnce(null);
        const req = { params: { id: '2' } } as unknown as Parameters<
            UserController['getOne']
        >[0];

        await controller.getOne(req, res as unknown as Response, next);

        expect(next).toHaveBeenCalledWith(
            createHttpError(400, 'User does not exist.'),
        );
    });

    it('deletes a user by id', async () => {
        const req = { params: { id: '2' } } as unknown as Parameters<
            UserController['destroy']
        >[0];

        await controller.destroy(req, res as unknown as Response, next);

        expect(service.deleteById).toHaveBeenCalledWith(2);
        expect(res.json).toHaveBeenCalledWith({ id: 2 });
    });
});
