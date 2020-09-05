import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { DailySnippet } from '../../shared/entities/snippet';

@Entity()
@Unique(['day', 'year'])
export default class DailySnippetModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  day!: number;

  @Column('int')
  year!: number;

  @Column('text')
  snippet: string = "";

  public async update(draft: Partial<DailySnippet>): Promise<DailySnippetModel> {
    // Ignore changes to the ID, day, and year
    if (draft.snippet !== undefined) {
      this.snippet = draft.snippet;
    }
    return await this.save();
  }

  public sanitize(): DailySnippet {
    return {
      id: this.id,
      day: this.day,
      year: this.year,
      snippet: this.snippet,
      todayTasks: [],
      tomorrowTasks: [],
    }
  }
}
