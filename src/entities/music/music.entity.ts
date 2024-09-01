import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('music')
export class Music {
    @PrimaryGeneratedColumn()
    id:number

    @Column({ name: 'name', type: 'varchar' })
    name: string

    @Column({ name: 'author', type: 'varchar' })
    author: string

    @Column({ name: 'path', type: 'varchar' })
    path: string

}