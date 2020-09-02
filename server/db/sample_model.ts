import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { SampleEntity } from '../../shared/entities/sample_entity';

@Entity()
export default class SampleModel extends BaseEntity implements SampleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  value!: string;
}
