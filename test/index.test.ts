jest.mock('../src/curl', () => ({ curl: jest.fn() }));

import stringArgv from 'string-argv';
import { freezeTime } from './helpers';
freezeTime();

function setDefaultCredentials() {
  process.env.AWS_ACCESS_KEY = 'AKIA1234';
  process.env.AWS_SECRET_KEY = 'SECRET1234';
  process.env.AWS_SESSION_TOKEN = 'SESSION1234';
}

const getArgv = (command: string): string[] =>
  stringArgv(command.replace('aws4curl', 'node src/index.js'));

const getCurlMock = () => require('../src/curl').curl as jest.Mock;

beforeEach(() => {
  jest.resetModules();
  process.env = {};
  process.argv = [];
});

test('throws error if no credentials are found', () => {
  process.argv = getArgv(
    'aws4curl --aws-region eu-central-1 --aws-service execute-api https://api-gateway-iam-service.com/endpoint -s'
  );

  const { run } = require('../src');

  expect(() => run()).toThrow();
  expect(() => run()).toThrowErrorMatchingInlineSnapshot(
    `"AWS_ACCESS_KEY was not found in the environment variables and it is required to sign the request"`
  );
});

test('throws error if no URL is given', () => {
  setDefaultCredentials();
  process.argv = getArgv(
    'aws4curl --aws-region eu-central-1 --aws-service execute-api -s'
  );

  const { run } = require('../src');

  expect(() => run()).toThrowErrorMatchingInlineSnapshot(
    `"An URL is required for curl to work"`
  );
});

test('works for standard call', () => {
  setDefaultCredentials();
  process.argv = getArgv(
    'aws4curl --aws-region eu-central-1 --aws-service execute-api https://api-gateway-iam-service.com/endpoint -s'
  );

  const { run } = require('../src');
  run();

  const curlMock = getCurlMock();
  expect(curlMock).toBeCalledTimes(1);
  expect(curlMock.mock.calls[0]).toMatchInlineSnapshot(`
                    Array [
                      Array [
                        "-H",
                        "Host: api-gateway-iam-service.com",
                        "-H",
                        "X-Amz-Security-Token: SESSION1234",
                        "-H",
                        "X-Amz-Date: 20190101T000000Z",
                        "-H",
                        "Authorization: AWS4-HMAC-SHA256 Credential=AKIA1234/20190101/eu-central-1/execute-api/aws4_request, SignedHeaders=host;x-amz-date;x-amz-security-token, Signature=7000486ffbb56b75b92ba490c20615ef74a6fd259e6b9d5618d9b7f097c22cee",
                        "https://api-gateway-iam-service.com/endpoint",
                        "-s",
                      ],
                    ]
          `);
});

test('merges headers and signs them', () => {
  setDefaultCredentials();
  process.argv = getArgv(
    'aws4curl -H "Content-Type: application/json" --request POST --data \'{}\' --aws-region eu-central-1 --aws-service execute-api https://api-gateway-iam-service.com/endpoint -s'
  );

  const { run } = require('../src');
  run();

  const curlMock = getCurlMock();
  expect(curlMock).toBeCalledTimes(1);
  expect(curlMock.mock.calls[0]).toMatchInlineSnapshot(`
                    Array [
                      Array [
                        "-H",
                        "Content-Type: application/json",
                        "-H",
                        "Host: api-gateway-iam-service.com",
                        "-H",
                        "Content-Length: 2",
                        "-H",
                        "X-Amz-Security-Token: SESSION1234",
                        "-H",
                        "X-Amz-Date: 20190101T000000Z",
                        "-H",
                        "Authorization: AWS4-HMAC-SHA256 Credential=AKIA1234/20190101/eu-central-1/execute-api/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-date;x-amz-security-token, Signature=7dcd2b4c2dccdd15ffeb037be91b1f2f0edc5d7eec7b0f7acb4d995b56eacd76",
                        "--request",
                        "POST",
                        "--data",
                        "{}",
                        "https://api-gateway-iam-service.com/endpoint",
                        "-s",
                      ],
                    ]
          `);
});
