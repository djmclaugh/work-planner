import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { WeeklySnippet } from '../../shared/entities/snippet';

@Entity()
@Unique(['week', 'year'])
export default class WeeklySnippetModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  week!: number;

  @Column('int')
  year!: number;

  @Column('text')
  snippet: string = "";

  public async update(draft: Partial<WeeklySnippet>): Promise<WeeklySnippetModel> {
    // Ignore changes to the ID, day, and year
    if (draft.snippet !== undefined) {
      this.snippet = draft.snippet;
    }
    return await this.save();
  }

  public sanitize(): WeeklySnippet {
    return {
      id: this.id,
      week: this.week,
      year: this.year,
      snippet: this.snippet,
      thisWeekTasks: [],
      nextWeekTasks: [],
    }
  }
}
