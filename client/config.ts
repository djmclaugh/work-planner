export interface ServerConfig {
  https: boolean,
  hostname: string,
  port: number,
}

export interface Config {
  server: ServerConfig,
}

// import * as configObject from './config.json';
import * as configObject from './config_default.json';

const chosenConfig = validateConfig(configObject);

function validateServerConfig(serverConfig: any): ServerConfig {
  if (typeof serverConfig.https !== 'boolean') {
    throw new Error('https for server needs to be specified');
  }
  const https: boolean = serverConfig.https;

  if (typeof serverConfig.hostname !== 'string') {
    throw new Error('hostname for server needs to be specified');
  }
  const hostname: string = serverConfig.hostname;

  if (!serverConfig.port || !Number.isInteger(serverConfig.port)) {
    throw new Error('A port number for the server needs to be specified.');
  }
  const port: number = serverConfig.port;

  return {
    https: https,
    hostname: hostname,
    port: port,
  }
}

function validateConfig(config: any): Config {
  if (!config.server) {
    throw new Error('Server config has to be specified.');
  }

  return {
    server: validateServerConfig(config.server),
  }
}

export function getConfig(): Config {
  return Object.assign({}, chosenConfig);
}
