import type { Repository } from 'typeorm';
import { UserService } from '../../services/userService';
import { Roles } from '../../constants';
import type { User } from '../../entities/User';
import { UserData } from '../../types';

type MockUserRepository = {
    findOne: jest.Mock;
    save: jest.Mock;
    createQueryBuilder: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
};

describe('UserService', () => {
    let repository: MockUserRepository;
    let service: UserService;

    beforeEach(() => {
        repository = {
            findOne: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        service = new UserService(repository as unknown as Repository<User>);
    });

    it('throws if the email already exists', async () => {
        repository.findOne.mockResolvedValue({ id: 1 });

        await expect(
            service.create({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                password: 'secret123',
                role: Roles.CUSTOMER,
            }),
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('creates a user with a tenant relation and default role', async () => {
        repository.findOne.mockResolvedValue(null);
        repository.save.mockResolvedValue({ id: 3 });

        const result = await service.create({
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com',
            password: 'secret123',
            tenantId: 2,
        } as UserData);

        expect(repository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                firstName: 'Jane',
                lastName: 'Doe',
                role: Roles.CUSTOMER,
                tenant: { id: 2 },
            }),
        );
        expect(result).toEqual({ id: 3 });
    });

    it('returns a user by email and handles repository errors', async () => {
        repository.findOne.mockResolvedValueOnce({ id: 4 });
        repository.findOne.mockRejectedValueOnce(new Error('db'));

        await expect(service.findByEmail('jane@example.com')).resolves.toEqual({
            id: 4,
        });
        await expect(
            service.findByEmail('bad@example.com'),
        ).rejects.toMatchObject({ statusCode: 500 });
    });

    it('updates a user and handles repository errors', async () => {
        repository.update
            .mockResolvedValueOnce({ affected: 1 })
            .mockRejectedValueOnce(new Error('db'));

        const updatePayload = {
            firstName: 'New',
            lastName: 'Name',
            role: 'customer',
            email: 'x@y.com',
        };
        await expect(service.update(5, updatePayload)).resolves.toEqual({
            affected: 1,
        });
        await expect(service.update(5, updatePayload)).rejects.toMatchObject({
            statusCode: 500,
        });
    });

    it('builds search and role filters for getAll', async () => {
        const queryBuilder = {
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn(() => Promise.resolve([[{ id: 1 }], 1])),
        };
        repository.createQueryBuilder.mockReturnValue(queryBuilder);

        const result = await service.getAll({
            q: 'john',
            role: 'admin',
            currentPage: 1,
            perPage: 10,
        });

        expect(queryBuilder.where).toHaveBeenCalled();
        expect(queryBuilder.andWhere).toHaveBeenCalledWith(
            'user.role = :role',
            { role: 'admin' },
        );
        expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
            'user.tenant',
            'tenant',
        );
        expect(result).toEqual([[{ id: 1 }], 1]);
    });
});
