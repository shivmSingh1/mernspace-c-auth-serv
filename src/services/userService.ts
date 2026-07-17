import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { UserData } from '../types';

export class UserService {
    // constructor(private userRepository: Repository<User>) {} //shortcut method of typscript

    private userRepository: Repository<User>;

    constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }

    async create({ firstName, lastName, email, password }: UserData) {
        // const userRepository = AppDataSource.getRepository(User);
        await this.userRepository.save({
            firstName,
            lastName,
            email,
            password,
        });
    }
}
