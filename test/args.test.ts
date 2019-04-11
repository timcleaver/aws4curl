import { parseHeader, getHeaders } from '../src/args';

test('parseHeader', () => {
  expect(parseHeader('Content-Type: application/json')).toEqual({
    key: 'Content-Type',
    value: 'application/json'
  });
});

test('getHeaders', () => {
  expect(
    getHeaders({
      H: ['Content-Type: application/json', 'X-Custom-Header: other'],
      header: 'Content-Length: 123'
    })
  ).toEqual({
    'Content-Type': 'application/json',
    'X-Custom-Header': 'other',
    'Content-Length': '123'
  });
});
