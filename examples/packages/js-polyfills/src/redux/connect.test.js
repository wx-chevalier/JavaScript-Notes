import connect from '../../src/redux/connect';

describe('connect', () => {
  it('返回值类型校验', () => {
    expect(typeof connect()).toBe('function');
  });
});
