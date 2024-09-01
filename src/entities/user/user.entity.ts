import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { E_Gender } from './types'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'login', type: 'varchar' })
  login: string;
  
  @Column({ name: 'email', type: 'varchar' })
  email: string

  @Column({ name: 'password', type: 'varchar' })
  password: string

  @Column({ name: 'gender', type: 'enum', enum: E_Gender, nullable: true })
  gender: E_Gender | null
}
