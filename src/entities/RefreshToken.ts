import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @ManyToOne(() => User)
    user: User;
}
