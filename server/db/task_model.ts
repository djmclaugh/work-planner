import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Task, TaskUpdate } from '../../shared/entities/task';

@Entity()
export default class TaskModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  description!: string;

  @OneToMany(() => TaskUpdateModel, taskUpdate => taskUpdate.task, {
    cascade: true,
    eager: true,
  })
  log!: TaskUpdateModel[];

  public async createLog(content: string): Promise<TaskUpdateModel> {
    const log = new TaskUpdateModel();
    log.timestamp = new Date();
    log.content = content;
    this.log.push(log);
    await this.save();
    return log;
  }

  public async update(draft: Partial<Task>): Promise<TaskModel> {
    // Ignore changes to the ID
    if (draft.description) {
      this.description = draft.description;
    }
    // Ignore changes to log elements.
    return await this.save();
  }

  public sanitize(): Task {
    return {
      id: this.id,
      description: this.description,
      log: !this.log ? [] : this.log.map(log => log.sanitize()),
    }
  }
}


@Entity()
export class TaskUpdateModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('datetime')
  timestamp!: Date;

  @Column('text')
  content!: string;

  @ManyToOne(() => TaskModel, task => task.log)
  task!: TaskModel;

  public async update(draft: Partial<TaskUpdate>): Promise<TaskUpdateModel> {
    // Ignore changes to the ID
    // Ignore changes to the timestamp
    if (draft.content) {
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
