import type { NextFunction, Request, Response } from 'express';
import type { AuthRequest } from '../../types';
import authenticate from '../../middlewares/authenticate';

describe('authenticate middleware', () => {
    it('returns 401 when no token is present', () => {
        const req = { headers: {}, cookies: {} } as unknown as Request;
        const res = {} as unknown as Response;
        const next = jest.fn() as unknown as NextFunction;

        authenticate(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('accepts a decoded token in test mode', () => {
        const req = {
            headers: {
                authorization:
                    'Bearer eyJhbGciOiJub25lIn0.eyJzdWIiOiIxIiwicm9sZSI6ImN1c3RvbWVyIn0.',
            },
            cookies: {},
        } as unknown as Request;
        const res = {} as unknown as Response;
        const next = jest.fn() as unknown as NextFunction;

        authenticate(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect((req as unknown as AuthRequest).auth).toEqual({
            sub: '1',
            role: 'customer',
        });
    });
});
