import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface RegisterUserInterface extends Request {
    body: UserData;
}

export class AuthController {
    async register(req: RegisterUserInterface, res: Response) {
        const { firstName, lastName, email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.save({ firstName, lastName, email, password });
        res.status(201).json();
    }
}
