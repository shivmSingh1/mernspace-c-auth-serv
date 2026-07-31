import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express';
import { TenantController } from '../controllers/TenantController';
import { TenantService } from '../services/TenantService';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entities/Tenants';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import logger from '../config/logger';
import listUserValidators from '../validators/list-user-validators';
import tenantValidators from '../validators/tenant.validators';
import { CreateTenantRequest } from '../types';
const tenantRouter = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);

const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

tenantRouter.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req, res, next) => tenantController.create(req, res, next),
);

tenantRouter.get(
    '/',
    listUserValidators,
    async (req: Request, res: Response, next: NextFunction) => {
        await tenantController.getAll(req, res, next);
    },
);

tenantRouter.patch(
    '/:id',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    tenantValidators,
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.update(req, res, next) as unknown as RequestHandler,
);

tenantRouter.get(
    '/:id',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) =>
        tenantController.getOne(req, res, next) as unknown as RequestHandler,
);

tenantRouter.delete(
    '/:id',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) =>
        tenantController.destroy(req, res, next) as unknown as RequestHandler,
);

export default tenantRouter;
