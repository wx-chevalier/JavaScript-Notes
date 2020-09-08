import '../../src/promise/xFinally';

describe('Promise.xFinally', () => {
  it('函数存在', () => {
    expect(typeof Promise.prototype.xFinally).toBe('function');
  });

  it('正常流程校验', () => {
    const clear = jest.fn();

    Promise.resolve(1)
      .xFinally(clear)
      .then(() => {
        expect(clear).toHaveBeenCalled();
      });
  });

  it('异常流程校验', () => {
    const clear = jest.fn();

    Promise.reject(new Error('error'))
      .xFinally(clear)
      .then(() => {
        expect(clear).toHaveBeenCalled();
      });
  });
});
