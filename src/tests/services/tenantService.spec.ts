import { Repository } from 'typeorm';
import { Tenant } from '../../entities/Tenants';
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

    it('creates a tenant', async () => {
        const tenant = {
            id: 1,
            name: 'Acme',
            address: 'Delhi',
        };

        repository.save.mockResolvedValue(tenant);

        const result = await service.create({
            name: 'Acme',
            address: 'Delhi',
        });

        expect(repository.save).toHaveBeenCalledWith({
            name: 'Acme',
            address: 'Delhi',
        });

        expect(result).toEqual(tenant);
    });

    it('gets all tenants with search', async () => {
        const queryBuilder = {
            where: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([[{ id: 1 }], 1]),
        };

        repository.createQueryBuilder.mockReturnValue(queryBuilder);

        const result = await service.getAll({
            q: 'acme',
            currentPage: 2,
            perPage: 5,
        });

        expect(queryBuilder.where).toHaveBeenCalled();
        expect(queryBuilder.skip).toHaveBeenCalledWith(5);
        expect(queryBuilder.take).toHaveBeenCalledWith(5);
        expect(queryBuilder.orderBy).toHaveBeenCalledWith('tenant.id', 'DESC');

        expect(result).toEqual([[{ id: 1 }], 1]);
    });

    it('gets all tenants without search', async () => {
        const queryBuilder = {
            where: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
        };

        repository.createQueryBuilder.mockReturnValue(queryBuilder);

        const result = await service.getAll({
            q: '',
            currentPage: 1,
            perPage: 10,
        });

        expect(queryBuilder.where).not.toHaveBeenCalled();
        expect(queryBuilder.skip).toHaveBeenCalledWith(0);
        expect(queryBuilder.take).toHaveBeenCalledWith(10);
        expect(queryBuilder.orderBy).toHaveBeenCalledWith('tenant.id', 'DESC');

        expect(result).toEqual([[], 0]);
    });

    it('updates tenant', async () => {
        repository.update.mockResolvedValue({
            affected: 1,
        });

        const result = await service.update(1, {
            name: 'Updated',
            address: 'Noida',
        });

        expect(repository.update).toHaveBeenCalledWith(1, {
            name: 'Updated',
            address: 'Noida',
        });

        expect(result).toEqual({
            affected: 1,
        });
    });

    it('gets tenant by id', async () => {
        repository.findOne.mockResolvedValue({
            id: 1,
        });

        const result = await service.getById(1);

        expect(repository.findOne).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
        });

        expect(result).toEqual({
            id: 1,
        });
    });

    it('deletes tenant', async () => {
        repository.delete.mockResolvedValue({
            affected: 1,
        });

        const result = await service.deleteById(1);

        expect(repository.delete).toHaveBeenCalledWith(1);

        expect(result).toEqual({
            affected: 1,
        });
    });
});
