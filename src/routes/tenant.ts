import express from 'express';
import { TenantController } from '../controllers/TenantController';
import { TenantService } from '../services/TenantService';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entities/Tenants';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
const tenantRouter = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);

const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService);

tenantRouter.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req, res, next) => tenantController.create(req, res, next),
);

export default tenantRouter;
