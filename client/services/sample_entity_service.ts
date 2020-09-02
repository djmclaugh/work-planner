import { get, post } from './request_service';

import { SampleEntity } from '../../shared/entities/sample_entity';

export function getSampleEntities(): Promise<SampleEntity[]> {
  return get('/api/sample');
}

export function createSampleEntities(): Promise<SampleEntity> {
  return post('/api/sample');
}

export function getSampleEntitie(id: number): Promise<SampleEntity> {
  return post('/api/sample/' + id);
}
