import { Repository } from 'typeorm';
import { TenantData } from '../types';
import { Tenant } from '../entities/Tenants';

export class TenantService {
    private tenantRepository: Repository<Tenant>;
    constructor(tenantRepository: Repository<Tenant>) {
        this.tenantRepository = tenantRepository;
    }
    create({ name, address }: TenantData) {
        const tenant = this.tenantRepository.save({ name, address });
        return tenant;
    }
}
