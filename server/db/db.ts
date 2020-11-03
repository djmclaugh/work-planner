import { Connection, createConnection } from 'typeorm';

import SampleModel from './sample_model';
import DailySnippetModel from './daily_snippet_model';
import TaskModel, { TaskUpdateModel } from './task_model';
import WeeklySnippetModel from './weekly_snippet_model';

import { getConfig } from '../config';

const dbConfig = getConfig().database;
let connection: Connection|null = null;

const callbacks: ((connection: Connection) => void)[] = [];

export function onConnect(cb: (connection: Connection) => void) {
  if (connection) {
    cb(connection);
  } else {
    callbacks.push(cb);
  }
}

const location = dbConfig.location;

createConnection({
  type: dbConfig.type,
  database: location,
  entities: [
    DailySnippetModel,
    SampleModel,
    TaskModel,
    TaskUpdateModel,
    WeeklySnippetModel,
  ],
  synchronize: true,
}).then(c => {
  console.log(`Successfully connected to ${dbConfig.type} database at ${location}.`);
  connection = c;
  for (const cb of callbacks) {
    cb(connection);
  }
  callbacks.splice(0, callbacks.length);
}).catch(error => {
  console.error('Error connecting to database:');
  console.error(error);
});
