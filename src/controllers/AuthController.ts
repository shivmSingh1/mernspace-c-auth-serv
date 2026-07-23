import { NextFunction, Response } from 'express';
import { RegisterUserInterface } from '../types';
import { UserService } from '../services/userService';
import { Logger } from 'winston';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { validationResult } from 'express-validator';
import { JwtPayload, sign } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { Config } from '../config';

export class AuthController {
    // private userService: UserService;
    // constructor(userService: UserService) {
    //     this.userService = userService;
    // }

    constructor(
        private userService: UserService,
        private logger: Logger,
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

            let privateKey: Buffer;
            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, '../../certs/privateKey.pem'),
                );
            } catch {
                const err = createHttpError(
                    500,
                    'error while reading privateKey',
                );
                next(err);
                return;
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h',
                issuer: 'auth-service',
            });

            const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET, {
                algorithm: 'HS256',
                expiresIn: '1y',
                issuer: 'auth-service',
            });

            res.cookie('access-token', accessToken, {
                httpOnly: true,
                secure: false,
                domain: 'localhost',
                maxAge: 1000 * 60 * 60,
            });

            res.cookie('refresh-token', refreshToken, {
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
}
