import { WeeklySnippet } from '../../shared/entities/snippet';
import { getWeeklySnippets, createWeeklySnippet, updateWeeklySnippet } from '../services/weekly_snippet_service';

export default class WeeklySnippetModel {
  private static singleton = new WeeklySnippetModel();
  public static getSingleton() {
    return this.singleton;
  }

  private dirty: boolean = true;
  private currentSnippets: WeeklySnippet[] = [];
  private snippetIdToIndex: Map<number, number> = new Map();

  private async fetchWeeklySnippet() {
    this.currentSnippets = await getWeeklySnippets();
    this.snippetIdToIndex = new Map();
    for (let i = 0; i < this.currentSnippets.length; ++i) {
      this.snippetIdToIndex.set(this.currentSnippets[i].id, i);
    }
    this.dirty = false;
  }

  public async getWeeklySnippets(): Promise<WeeklySnippet[]> {
    if (this.dirty) {
      await this.fetchWeeklySnippet();
    }
    return this.currentSnippets.concat();
  }

  public async getWeeklySnippet(taskId: number): Promise<WeeklySnippet> {
    if (this.dirty) {
      await this.fetchWeeklySnippet();
    }
    return this.currentSnippets[this.snippetIdToIndex.get(taskId)!];
  }

  public async createWeeklySnippet(draft: Partial<WeeklySnippet>): Promise<WeeklySnippet> {
    try {
      const newWeeklySnippet = await createWeeklySnippet(draft);
      this.currentSnippets.push(newWeeklySnippet);
      this.snippetIdToIndex.set(newWeeklySnippet.id, this.currentSnippets.length - 1);
      return newWeeklySnippet;
    } catch (e) {
      this.dirty = true;
      throw e;
    }
  }

  public async updateWeeklySnippet(taskId: number, draft: Partial<WeeklySnippet>): Promise<WeeklySnippet> {
    try {
      const newWeeklySnippet = await updateWeeklySnippet(taskId, draft);
      this.currentSnippets[this.snippetIdToIndex.get(taskId)!] = newWeeklySnippet;
      return newWeeklySnippet;
    } catch (e) {
      this.dirty = true;
      throw e;
    }
  }
}
