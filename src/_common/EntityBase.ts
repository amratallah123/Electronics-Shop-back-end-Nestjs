import {
	BaseEntity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	CreateDateColumn,
	Column,
} from 'typeorm'

export abstract class EntityBase extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date

  @Column({ name: 'created_by', type: 'varchar', length: '100', default: 'app_dev' })
  createdBy: string

  @Column({ name: 'updated_by', type: 'varchar', length: '100', nullable: true })
  updatedBy?: string

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean
}
