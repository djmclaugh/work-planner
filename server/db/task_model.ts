import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Task, TaskUpdate } from '../../shared/entities/task';

@Entity()
export default class TaskModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  description!: string;

  @Column('int')
  startDate: number = 0;

  @Column('int')
  dueDate: number = 0;

  @Column('int')
  completionDate: number = 0;

  @OneToMany(() => TaskUpdateModel, taskUpdate => taskUpdate.task, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  log!: TaskUpdateModel[];

  public async createLog(content: string): Promise<TaskUpdateModel> {
    const log = new TaskUpdateModel();
    log.timestamp = (new Date()).getTime();
    log.content = content;
    this.log.push(log);
    await this.save();
    return log;
  }

  public async update(draft: Partial<Task>): Promise<TaskModel> {
    // Ignore changes to the ID
    if (draft.description !== undefined) {
      this.description = draft.description;
    }
    if (draft.startDate !== undefined) {
      this.startDate = draft.startDate;
    }
    if (draft.dueDate !== undefined) {
      this.dueDate = draft.dueDate;
    }
    if (draft.completionDate !== undefined) {
      this.completionDate = draft.completionDate;
    }
    // Ignore changes to log elements.
    return await this.save();
  }

  public sanitize(): Task {
    return {
      id: this.id,
      description: this.description,
      startDate: this.startDate,
      dueDate: this.dueDate,
      completionDate: this.completionDate,
      log: !this.log ? [] : this.log.map(log => log.sanitize()),
    }
  }
}


@Entity()
export class TaskUpdateModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  timestamp!: number;

  @Column('text')
  content!: string;

  @ManyToOne(() => TaskModel, task => task.log)
  task!: TaskModel;

  public async update(draft: Partial<TaskUpdate>): Promise<TaskUpdateModel> {
    // Ignore changes to the ID
    // Ignore changes to the timestamp
    if (draft.content !== undefined) {
      this.content = draft.content;
    }
    // Ignore changes to task.
    return await this.save();
  }

  public sanitize(): TaskUpdate {
    return {
      id: this.id,
      timestamp: this.timestamp,
      content: this.content
    };
  }
}
