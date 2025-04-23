import { Role } from 'src/auth/enums/role.enum';
import {
    Column,
    CreateDateColumn,
    Entity,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    BaseEntity,
  } from 'typeorm';
  
  @Entity('user')
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ select: false })
    password: string;
  
    @Column({ nullable: true })
    image: string;
  
    @Column({
      type: 'enum',
      enum: Role,
      default: Role.Client,
    })
    role: Role;
  
    @Column({ nullable: true, select: false })
    passVerificationCode: string;
  
    @Column({ nullable: true, select: false })
    passExpiryTime: string;
  
    @Column({ default: false, select: false })
    isDeleted: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  