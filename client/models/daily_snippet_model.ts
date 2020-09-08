import { DailySnippet } from '../../shared/entities/snippet';
import { getDailySnippets, createDailySnippet, updateDailySnippet } from '../services/daily_snippet_service';

export default class DailySnippetModel {
  private static singleton = new DailySnippetModel();
  public static getSingleton() {
    return this.singleton;
  }

  private dirty: boolean = true;
  private currentSnippets: DailySnippet[] = [];
  private snippetIdToIndex: Map<number, number> = new Map();

  private async fetchDailySnippet() {
    this.currentSnippets = await getDailySnippets();
    this.snippetIdToIndex = new Map();
    for (let i = 0; i < this.currentSnippets.length; ++i) {
      this.snippetIdToIndex.set(this.currentSnippets[i].id, i);
    }
    this.dirty = false;
  }

  public async getDailySnippets(): Promise<DailySnippet[]> {
    if (this.dirty) {
      await this.fetchDailySnippet();
    }
    return this.currentSnippets.concat();
  }

  public async getDailySnippet(taskId: number): Promise<DailySnippet> {
    if (this.dirty) {
      await this.fetchDailySnippet();
    }
    return this.currentSnippets[this.snippetIdToIndex.get(taskId)!];
  }

  public async createDailySnippet(draft: Partial<DailySnippet>): Promise<DailySnippet> {
    try {
      const newDailySnippet = await createDailySnippet(draft);
      this.currentSnippets.push(newDailySnippet);
      this.snippetIdToIndex.set(newDailySnippet.id, this.currentSnippets.length - 1);
      return newDailySnippet;
    } catch (e) {
      this.dirty = true;
      throw e;
    }
  }

  public async updateDailySnippet(taskId: number, draft: Partial<DailySnippet>): Promise<DailySnippet> {
    try {
      const newDailySnippet = await updateDailySnippet(taskId, draft);
      this.currentSnippets[this.snippetIdToIndex.get(taskId)!] = newDailySnippet;
      return newDailySnippet;
    } catch (e) {
      this.dirty = true;
      throw e;
    }
  }
}
