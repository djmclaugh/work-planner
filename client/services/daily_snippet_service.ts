import { get, post, put } from './request_service';

import { DailySnippet } from '../../shared/entities/snippet';

const COLLECTION_PATH = 'api/daily';
const SINGLETON_PATH = 'api/daily/:snippetID';

function singletonPath(snippetId: number): string {
  return SINGLETON_PATH.replace(':snippetID', snippetId.toString());
}

export function getDailySnippets(): Promise<DailySnippet[]> {
  return get(COLLECTION_PATH);
}

export function createDailySnippet(draft: Partial<DailySnippet>): Promise<DailySnippet> {
  return post(COLLECTION_PATH, draft);
}

export function getDailySnippet(snippetId: number): Promise<DailySnippet> {
  return get(singletonPath(snippetId));
}

export function updateDailySnippet(snippetId: number, draft: Partial<DailySnippet>): Promise<DailySnippet> {
  return put(singletonPath(snippetId), draft);
}
