import express, { NextFunction, RequestHandler, Response } from 'express';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import { AppDataSource } from '../config/data-source';
import logger from '../config/logger';
import { CreateUserRequest, UpdateUserRequest } from '../types';
import { Request } from 'express-jwt';
import { User } from '../entities/User';
import { UserService } from '../services/userService';
import { UserController } from '../controllers/UserController';
import createUserValidator from '../validators/createUserValidator';
import updateUserValidator from '../validators/updateUserValidator';
import listUserValidators from '../validators/list-user-validators';

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

router.post(
    '/',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    createUserValidator,
    (req: CreateUserRequest, res: Response, next: NextFunction) =>
        userController.create(req, res, next) as unknown as RequestHandler,
);

router.patch(
    '/:id',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    updateUserValidator,
    (req: UpdateUserRequest, res: Response, next: NextFunction) =>
        userController.update(req, res, next) as unknown as RequestHandler,
);

router.get(
    '/',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    listUserValidators,
    (req: Request, res: Response, next: NextFunction) =>
        userController.getAll(req, res, next) as unknown as RequestHandler,
);

router.get(
    '/:id',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) =>
        userController.getOne(req, res, next) as unknown as RequestHandler,
);

router.delete(
    '/:id',
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) =>
        userController.destroy(req, res, next) as unknown as RequestHandler,
);

export default router;
