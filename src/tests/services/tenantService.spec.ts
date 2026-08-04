import type { Repository } from 'typeorm';
import type { Tenant } from '../../entities/Tenants';
import { TenantService } from '../../services/TenantService';

type MockTenantRepository = {
    save: jest.Mock;
    createQueryBuilder: jest.Mock;
    update: jest.Mock;
    findOne: jest.Mock;
    delete: jest.Mock;
};

describe('TenantService', () => {
    let repository: MockTenantRepository;
    let service: TenantService;

    beforeEach(() => {
        repository = {
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
        };
        service = new TenantService(
            repository as unknown as Repository<Tenant>,
        );
    });

    it('creates a tenant via the repository', async () => {
        const tenant = { id: 1, name: 'Acme', address: 'NY' };
        repository.save.mockResolvedValue(tenant);

        const result = await service.create({ name: 'Acme', address: 'NY' });

        expect(repository.save).toHaveBeenCalledWith({
            name: 'Acme',
            address: 'NY',
        });
        expect(result).toEqual(tenant);
    });

    it('applies search and pagination when fetching tenants', async () => {
        const queryBuilder = {
            where: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn(() => Promise.resolve([[{ id: 1 }], 1])),
        };
        repository.createQueryBuilder.mockReturnValue(queryBuilder);

        const result = await service.getAll({
            q: 'acme',
            currentPage: 2,
            perPage: 5,
        });

        expect(repository.createQueryBuilder).toHaveBeenCalledWith('tenant');
        expect(queryBuilder.where).toHaveBeenCalledWith(
            "CONCAT(tenant.name, ' ', tenant.address) ILike :q",
            { q: '%acme%' },
        );
        expect(queryBuilder.skip).toHaveBeenCalledWith(5);
        expect(queryBuilder.take).toHaveBeenCalledWith(5);
        expect(queryBuilder.orderBy).toHaveBeenCalledWith('tenant.id', 'DESC');
        expect(result).toEqual([[{ id: 1 }], 1]);
    });

    it('delegates tenant updates, lookups, and deletes', async () => {
        repository.update.mockResolvedValue({ affected: 1 });
        repository.findOne.mockResolvedValue({ id: 2 });
        repository.delete.mockResolvedValue({ affected: 1 });

        await expect(
            service.update(2, { name: 'x', address: 'y' }),
        ).resolves.toEqual({ affected: 1 });
        await expect(service.getById(2)).resolves.toEqual({ id: 2 });
        await expect(service.deleteById(2)).resolves.toEqual({ affected: 1 });

        expect(repository.update).toHaveBeenCalledWith(2, {
            name: 'x',
            address: 'y',
        });
        expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
        expect(repository.delete).toHaveBeenCalledWith(2);
    });
});
