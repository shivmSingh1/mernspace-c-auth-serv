import { NextFunction, Response } from 'express';
import { ITenantRequest } from '../types';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { TenantService } from '../services/TenantService';

export class TenantController {
    private tenantService: TenantService;
    constructor(tenantService: TenantService) {
        this.tenantService = tenantService;
    }

    async create(req: ITenantRequest, res: Response, next: NextFunction) {
        const { name, address } = req.body;
        //validation
        const result = validationResult(req);

        if (!result.isEmpty()) {
            throw createHttpError(400, {
                message: result.array().map((err) => String(err.msg)),
                errors: result.array(),
            });
        }

        try {
            const tenant = await this.tenantService.create({ name, address });
            return res.status(201).json({ id: tenant.id });
        } catch (error) {
            next(error);
        }
    }
}
