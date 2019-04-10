import { parse as urlParser } from 'url';
import { curl } from './curl';

const isUrl = require('is-url');
const aws4 = require('aws4');
const minimist = require('minimist');

interface AWS4Options {
  host: string;
  path: string;
  region: string;
  service: string;
  body?: string;
  headers?: any;
}

function version() {
  console.log(require('../package.json').version);
}

function help() {
  console.log(`
curl, but with AWS Signature Version 4

usage: aws4curl [aws4curl options] [curl options]

aws4curl options:
  --aws-region AWS Region to sign requests with (required)
  --aws-service AWS Service (required)

curl options:
  Every flag and argument will be passed to your installed curl
`);
}

export function run() {
  let { argv } = process;

  // Remove initial two args (node and file)
  argv.splice(0, 2);

  let removeArg = (arg: string, numberFollowing: number) => {
    const index = argv.indexOf(arg);
    if (index !== -1) {
      argv.splice(index, numberFollowing);
    }
  };

  const parsedArgs = minimist(argv);

  if (parsedArgs.version) {
    return version();
  }

  if (parsedArgs.help) {
    return help();
  }

  const region = parsedArgs['aws-region'];
  if (typeof region !== 'string') {
    throw new Error('--aws-region is mandatory (e.g. eu-central-1)');
  }
  removeArg('--aws-region', 2);

  const service = parsedArgs['aws-service'];
  if (typeof service !== 'string') {
    throw new Error('--aws-service is mandatory (e.g. execute-api)');
  }
  removeArg('--aws-service', 2);

  const url = argv.find(arg => isUrl(arg));
  if (!url) {
    throw new Error('An URL is required for curl to work');
  }

  const parsedUrl = urlParser(url);
  const { host, path } = parsedUrl;
  if (!host) {
    throw new Error('URL does not have a valid host');
  }
  if (!path) {
    throw new Error('URL does not have a valid path');
  }

  const options: AWS4Options = {
    host,
    path,
    region,
    service
  };

  aws4.sign(options);
  if (!options.headers) {
    throw new Error('The signature could not be created');
  }

  const curlArgs: string[] = [];
  const addHeaderIfAvailable = (header: string) => {
    if (options.headers[header]) {
      curlArgs.push('-H');
      curlArgs.push(`${header}: ${options.headers[header]}`);
    }
  };

  addHeaderIfAvailable('Host');
  addHeaderIfAvailable('X-Amz-Date');
  addHeaderIfAvailable('X-Amz-Security-Token');
  addHeaderIfAvailable('Content-Type');
  addHeaderIfAvailable('Content-Length');
  addHeaderIfAvailable('Authorization');
  curlArgs.push(...argv);

  curl(curlArgs);
}
