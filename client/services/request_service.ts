import * as http from 'http';
import * as https from 'https';

import { getConfig, ServerConfig } from '../config';

const config: ServerConfig = getConfig().server;
const client = config.https ? https : http;

export function call(method: 'GET'|'POST'|'PUT'|'DELETE', path: string, req?: any): Promise<any> {
  const promise: Promise<any> = new Promise((resolve, reject) => {
    const clientRequest = client.request({
      hostname: config.hostname,
      port: config.port,
      path: config.base + path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    }, (res) => {
      let response: string = '';
      res.on('data', (chunk) => {
        response += chunk;
      });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          if (response.length > 0) {
            try {
              resolve(JSON.parse(response));
            } catch(e) {
              console.error(`Error while fetching ${method} at ${path}`);
              console.error('Failed to parse following object:');
              console.error(response);
              reject(e);
            }
          } else {
            resolve("");
          }
        } else {
          reject(new Error(res.statusCode + ': ' + response));
        }
      });
    });
    if (req) {
      clientRequest.write(JSON.stringify(req));
    }
    clientRequest.on('error', (error) => {
      reject(error);
    });
    clientRequest.end();
  });
  return promise;
}

export function get(path: string): Promise<any> {
  return call('GET', path);
}

export function post(path: string, req?: any): Promise<any> {
  return call('POST', path, req);
}

export function put(path: string, req?: any): Promise<any> {
  return call('PUT', path, req);
}

// delete is a typescript keyword, so this method is called remove instead.
export function remove(path: string): Promise<any> {
  return call('DELETE', path);
}
