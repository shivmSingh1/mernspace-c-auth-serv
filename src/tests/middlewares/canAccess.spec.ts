import type { Request, Response } from 'express';
import { canAccess } from '../../middlewares/canAccess';
import type { AuthRequest } from '../../types';

describe('canAccess middleware', () => {
    it('allows the permitted role', () => {
        const req = { auth: { role: 'admin' } } as AuthRequest;
        const res = {} as Response;
        const next = jest.fn();

        canAccess(['admin'])(req as Request, res, next);

        expect(next).toHaveBeenCalledWith();
    });

    it('blocks a disallowed role with 403', () => {
        const req = { auth: { role: 'customer' } } as AuthRequest;
        const res = {} as Response;
        const next = jest.fn();

        canAccess(['admin'])(req as Request, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});
