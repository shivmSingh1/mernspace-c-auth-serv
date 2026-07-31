import { Repository } from 'typeorm';
import { TenantData, TenantQueryParams } from '../types';
import { Tenant } from '../entities/Tenants';

export class TenantService {
    private tenantRepository: Repository<Tenant>;
    constructor(tenantRepository: Repository<Tenant>) {
        this.tenantRepository = tenantRepository;
    }
    async create({ name, address }: TenantData) {
        const tenant = this.tenantRepository.save({ name, address });
        return tenant;
    }

    async getAll(validatedQuery: TenantQueryParams) {
        const queryBuilder = this.tenantRepository.createQueryBuilder('tenant');

        if (validatedQuery.q) {
            const searchTerm = `%${validatedQuery.q}%`;
            queryBuilder.where(
                "CONCAT(tenant.name, ' ', tenant.address) ILike :q",
                { q: searchTerm },
            );
        }

        const result = await queryBuilder
            .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
            .take(validatedQuery.perPage)
            .orderBy('tenant.id', 'DESC')
            .getManyAndCount();
        return result;
    }

    async update(id: number, tenantData: TenantData) {
        return await this.tenantRepository.update(id, tenantData);
    }

    async getById(tenantId: number) {
        return await this.tenantRepository.findOne({ where: { id: tenantId } });
    }

    async deleteById(tenantId: number) {
        return await this.tenantRepository.delete(tenantId);
    }
}
