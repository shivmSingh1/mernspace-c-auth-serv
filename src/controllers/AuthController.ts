import { Response } from 'express';
import { RegisterUserInterface } from '../types';
import { UserService } from '../services/userService';

export class AuthController {
    userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService;
    }

    async register(req: RegisterUserInterface, res: Response) {
        const { firstName, lastName, email, password } = req.body;
        const user = await this.userService.create({
            firstName,
            lastName,
            email,
            password,
        });
        res.status(201).json({
            id: user.id,
        });
    }
}
