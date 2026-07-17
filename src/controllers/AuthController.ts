import { NextFunction, Response } from 'express';
import { RegisterUserInterface } from '../types';
import { UserService } from '../services/userService';
import { Logger } from 'winston';

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

        let user;
        try {
            user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });

            this.logger.info('user has been registerd', { id: user.id });
            res.status(201).json({
                id: user?.id,
            });
        } catch (error) {
            next(error);
            return;
        }
    }
}
