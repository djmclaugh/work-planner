import { Connection, createConnection } from 'typeorm';

import SampleModel from './sample_model';

import { getConfig, Config } from '../config';

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

createConnection({
  type: dbConfig.type,
  database: dbConfig.location,
  entities: [
    SampleModel,
  ],
  synchronize: true,
}).then(c => {
  console.log(`Successfully connected to ${dbConfig.type} database at ${dbConfig.location}.`);
  connection = c;
  for (const cb of callbacks) {
    cb(connection);
  }
  callbacks.splice(0, callbacks.length);
}).catch(error => {
  console.error('Error connecting to database:');
  console.error(error);
});
