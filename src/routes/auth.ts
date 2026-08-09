import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/userService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import logger from '../config/logger';
import registerValidator from '../validators/register.validator';
import { TokenService } from '../services/tokenService';
import { RefreshToken } from '../entities/RefreshToken';
import loginValidators from '../validators/login.validators';
import { CredentialService } from '../services/CredentialService';
import authenticate from '../middlewares/authenticate';
import { AuthRequest } from '../types';
import validateRefreshToken from '../middlewares/validateRefreshToken';
import parseRefreshToken from '../middlewares/parseRefreshToken';
const router = express.Router();

//dependency injection

const userRepository = AppDataSource.getRepository(User); //caling getRepository method of AppDataSocure (DataSource) obj
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

//creating obj to services
const userService = new UserService(userRepository);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();

const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
); // injecting dependency (obj) to auth controller

router.post(
    '/register',
    registerValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.register(req, res, next);
    },
);

router.post(
    '/login',
    loginValidators,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.login(req, res, next);
    },
);

router.get(
    '/self',
    authenticate as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        authController.self(req as AuthRequest, res, next),
);

router.post(
    '/refresh',
    validateRefreshToken as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        authController.refresh(req as AuthRequest, res, next),
);

router.post(
    '/logout',
    authenticate as RequestHandler,
    authenticate,
    parseRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        authController.logout(req as AuthRequest, res, next),
);

export default router;
