export function freezeTime() {
  const DATE_TO_USE = new Date('2019');
  const _Date = Date;
  global.Date = (jest.fn(() => DATE_TO_USE) as unknown) as DateConstructor;
  global.Date.UTC = _Date.UTC;
  global.Date.parse = _Date.parse;
  global.Date.now = _Date.now;
}
