import { NextFunction, Response } from 'express';
import { AuthRequest, RegisterUserInterface } from '../types';
import { UserService } from '../services/userService';
import { Logger } from 'winston';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { validationResult } from 'express-validator';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from '../services/tokenService';
import { CredentialService } from '../services/CredentialService';

export class AuthController {
    // private userService: UserService;
    // constructor(userService: UserService) {
    //     this.userService = userService;
    // }

    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
    ) {}

    async register(
        req: RegisterUserInterface,
        res: Response,
        next: NextFunction,
    ) {
        const { firstName, lastName, email, password } = req.body;

        this.logger.debug('new request to register a user', {
            firstName,
            lastName,
            email,
            password: '******',
        });

        //validation
        const result = validationResult(req);

        if (!result.isEmpty()) {
            throw createHttpError(400, {
                message: result.array().map((err) => String(err.msg)),
                errors: result.array(),
            });
        }

        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        let user;
        try {
            user = await this.userService.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            });

            // this.logger.info('user has been registerd', { id: user.id });

            // const accessToken =
            //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzaGl2YW1AZ21haWwuY29tIiwicm9sZSI6IkNVU1RPTUVSIn0.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';

            // const refreshToken =
            //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6InJlZnJlc2gifQ.s5cJ7wM2j4k8R1V9N0XxYzAbCdEfGhIjKlMnOpQrStU';

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            //persist the refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const accessToken = this.tokenService.generateAccessToken(payload);
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: newRefreshToken.id,
            });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                domain: 'localhost',
                maxAge: 1000 * 60 * 60,
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                domain: 'localhost',
                maxAge: 1000 * 60 * 60 * 24 * 360,
            });

            res.status(201).json({
                id: user?.id,
            });
        } catch (error) {
            next(error);
            return;
        }
    }

    async login(req: RegisterUserInterface, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        this.logger.debug('new request to logged in a user', {
            email,
            password: '******',
        });

        //validation
        const result = validationResult(req);

        if (!result.isEmpty()) {
            throw createHttpError(400, {
                message: result.array().map((err) => String(err.msg)),
                errors: result.array(),
            });
        }

        let user;
        try {
            user = await this.userService.findByEmail(email);

            if (!user) {
                const err = createHttpError(
                    400,
                    'Email or Password is incorrect',
                );
                next(err);
                return;
            }

            const isPasswordMatched =
                await this.credentialService.comparePassword(
                    password,
                    user.password,
                );

            if (!isPasswordMatched) {
                const err = createHttpError(
                    400,
                    'Email or Password is incorrect',
                );
                next(err);
                return;
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            //persist the refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const accessToken = this.tokenService.generateAccessToken(payload);
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: newRefreshToken.id,
            });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                domain: 'localhost',
                maxAge: 1000 * 60 * 60,
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                domain: 'localhost',
                maxAge: 1000 * 60 * 60 * 24 * 360,
            });

            this.logger.info('user logged in successfully', { id: user.id });

            res.status(200).json({
                id: user?.id,
            });
        } catch (error) {
            next(error);
            return;
        }
    }

    async self(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.findById(Number(req.auth.sub));

            if (!user) {
                return res.status(200).json({
                    id: Number(req.auth.sub),
                    role: req.auth.role,
                });
            }

            res.json({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            });
        } catch (err) {
            next(err);
        }
    }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const payload: JwtPayload = {
                sub: req.auth.sub,
                role: req.auth.role,
                tenant: req.auth.tenant,
                firstName: req.auth.firstName,
                lastName: req.auth.lastName,
                email: req.auth.email,
                id: req.auth.id,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const user = await this.userService.findById(Number(req.auth.sub));
            if (!user) {
                const error = createHttpError(
                    400,
                    'User with the token could not find',
                );
                next(error);
                return;
            }

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            await this.tokenService.deleteRefreshToken(Number(req.auth.id));

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 1, // 1d
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
            });

            this.logger.info('User has been logged in', { id: user.id });
            res.json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));
            this.logger.info('Refresh token has been deleted', {
                id: req.auth.id,
            });
            this.logger.info('User has been logged out', { id: req.auth.sub });

            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.json({});
        } catch (err) {
            next(err);
            return;
        }
    }
}
