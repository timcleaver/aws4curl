import { parse as urlParser } from 'url';
import { curl } from './curl';
import { validateCredentials } from './credentials';
import { getHeaders, getBody, getMethod } from './args';

const isUrl = require('is-url');
const aws4 = require('aws4');
const minimist = require('minimist');

interface AWS4Options {
  host: string;
  path: string;
  region: string;
  service: string;
  body?: string;
  method?: string;
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

AWS Credentials:
Environment variables AWS_ACCESS_KEY and AWS_SECRET_KEY must be defined.
If AWS_SESSION_TOKEN is available, it will be used to generate the header
"X-Amz-Security-Token"

curl options:
  Every flag and argument will be passed to your installed curl
`);
}

function removeArg(argv: any, arg: string, numberFollowing: number) {
  const index = argv.indexOf(arg);
  if (index !== -1) {
    return argv.splice(index, numberFollowing);
  }
}

function addHeader(to: string[], headers: any, header: string) {
  if (headers[header]) {
    to.push('-H');
    to.push(`${header}: ${headers[header]}`);
  }
}

export function run() {
  let { argv } = process;

  // Remove initial two args (node and file)
  argv.splice(0, 2);

  const parsedArgs = minimist(argv);

  if (parsedArgs.version) {
    return version();
  }

  if (parsedArgs.help) {
    return help();
  }

  validateCredentials();

  // Get AWS Region
  const region = parsedArgs['aws-region'];
  if (typeof region !== 'string') {
    throw new Error('--aws-region is mandatory (e.g. eu-central-1)');
  }
  removeArg(argv, '--aws-region', 2);

  // Get AWS Service
  const service = parsedArgs['aws-service'];
  if (typeof service !== 'string') {
    throw new Error('--aws-service is mandatory (e.g. execute-api)');
  }
  removeArg(argv, '--aws-service', 2);

  // Get URL
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

  // Handle curl headers
  const headers = getHeaders(parsedArgs);

  // Remove all headers, we will add them back later after signing them
  while (removeArg(argv, '-H', 2)) {}
  while (removeArg(argv, '--header', 2)) {}

  const body = getBody(parsedArgs);
  const method = getMethod(parsedArgs);

  const options: AWS4Options = {
    host,
    path,
    region,
    service,
    headers,
    body,
    method
  };

  // Finally, sign the request, which mutates the variable
  aws4.sign(options);

  if (!options.headers) {
    throw new Error('The signature could not be created');
  }

  // Build curl arguments
  const curlArgs: string[] = [];

  Object.keys(options.headers).forEach(headerKey => {
    addHeader(curlArgs, options.headers, headerKey);
  });
  curlArgs.push(...argv);

  curl(curlArgs);
}
