import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Tenants' })
export class Tenant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: '50' })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    address: string;
}
