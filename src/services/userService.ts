import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { UserData } from '../types';
import createHttpError from 'http-errors';
import { Roles } from '../constants';

export class UserService {
    // constructor(private userRepository: Repository<User>) {} //shortcut method of typscript

    private userRepository: Repository<User>;

    constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }

    async create({ firstName, lastName, email, password }: UserData) {
        // const userRepository = AppDataSource.getRepository(User);
        try {
            const user = await this.userRepository.save({
                firstName,
                lastName,
                email,
                password,
                role: Roles.CUSTOMER,
            });
            return user;
        } catch {
            const error = createHttpError(
                500,
                'failed to save user in database.',
            );
            throw error;
        }
    }
}
