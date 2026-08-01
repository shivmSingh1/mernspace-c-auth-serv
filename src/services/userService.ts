import { Brackets, Repository } from 'typeorm';
import { User } from '../entities/User';
import { LimitedUserData, UserData, UserQueryParams } from '../types';
import createHttpError from 'http-errors';
import { Roles } from '../constants';

export class UserService {
    // constructor(private userRepository: Repository<User>) {} //shortcut method of typscript

    private userRepository: Repository<User>;

    constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }

    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
    }: UserData): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (user) {
            const err = createHttpError(400, 'Email is already exists!');
            throw err;
        }

        try {
            const userToCreate: Partial<User> = {
                firstName,
                lastName,
                email,
                password,
                role: role ?? Roles.CUSTOMER,
            };

            if (tenantId !== undefined) {
                userToCreate.tenant = { id: tenantId } as User['tenant'];
            }

            return await this.userRepository.save(userToCreate);
        } catch {
            const error = createHttpError(
                500,
                'Failed to store the data in the database',
            );
            throw error;
        }
    }

    async findByEmail(email: string) {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
            });
            return user;
        } catch {
            const err = createHttpError(500, 'something went wrong');
            throw err;
        }
    }

    // async findById(id: number) {
    //     try {
    //         const user = await this.userRepository.findOne({ where: { id } });
    //         return user;
    //     } catch {
    //         const err = createHttpError(500, 'something went wrong');
    //         throw err;
    //     }
    // }

    async findByEmailWithPassword(email: string) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                password: true,
            },
            relations: {
                tenant: true,
            },
        });
        return user;
    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
            },
            relations: {
                tenant: true,
            },
        });
    }

    async update(
        userId: number,
        { firstName, lastName, role, email, tenantId }: LimitedUserData,
    ) {
        try {
            const updatePayload: Partial<User> = {
                firstName,
                lastName,
                role,
                email,
            };

            if (tenantId !== undefined) {
                updatePayload.tenant = { id: tenantId } as User['tenant'];
            }

            return await this.userRepository.update(userId, updatePayload);
        } catch {
            const error = createHttpError(
                500,
                'Failed to update the user in the database',
            );
            throw error;
        }
    }

    async getAll(validatedQuery: UserQueryParams) {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (validatedQuery.q) {
            const searchTerm = `%${validatedQuery.q}%`;
            queryBuilder.where(
                new Brackets((qb) => {
                    qb.where(
                        "CONCAT(user.firstName, ' ', user.lastName) ILike :q",
                        { q: searchTerm },
                    ).orWhere('user.email ILike :q', { q: searchTerm });
                }),
            );
        }

        if (validatedQuery.role) {
            queryBuilder.andWhere('user.role = :role', {
                role: validatedQuery.role,
            });
        }

        const result = await queryBuilder
            .leftJoinAndSelect('user.tenant', 'tenant')
            .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
            .take(validatedQuery.perPage)
            .orderBy('user.id', 'DESC')
            .getManyAndCount();
        return result;
    }

    async deleteById(userId: number) {
        return await this.userRepository.delete(userId);
    }
}
