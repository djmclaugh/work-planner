import { get, post, put } from './request_service';

import { WeeklySnippet } from '../../shared/entities/snippet';

const COLLECTION_PATH = 'api/weekly';
const SINGLETON_PATH = 'api/weekly/:snippetID';

function singletonPath(snippetId: number): string {
  return SINGLETON_PATH.replace(':snippetID', snippetId.toString());
}

export function getWeeklySnippets(): Promise<WeeklySnippet[]> {
  return get(COLLECTION_PATH);
}

export function createWeeklySnippet(draft: Partial<WeeklySnippet>): Promise<WeeklySnippet> {
  return post(COLLECTION_PATH, draft);
}

export function getWeeklySnippet(snippetId: number): Promise<WeeklySnippet> {
  return get(singletonPath(snippetId));
}

export function updateWeeklySnippet(snippetId: number, draft: Partial<WeeklySnippet>): Promise<WeeklySnippet> {
  return put(singletonPath(snippetId), draft);
}
