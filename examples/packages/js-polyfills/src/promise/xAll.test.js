import '../../src/promise/xAll';

describe('Promise.xAll', () => {
  it('函数存在', () => {
    expect(typeof Promise.xAll).toBe('function');
  });

  it('数组形式', () => {
    const results = [3, 42, 'foo'];

    const promise1 = Promise.resolve(3);
    const promise2 = 42;
    const promise3 = new Promise((resolve) => {
      setTimeout(resolve, 100, 'foo');
    });

    expect.assertions(1);

    return Promise.xAll([promise1, promise2, promise3]).then((values) => {
      expect(values).toEqual(results);
    });
  });

  it('对象形式', () => {
    const results = {
      a: 3,
      b: 42,
      c: 'foo',
    };

    const promise1 = Promise.resolve(3);
    const promise2 = 42;
    const promise3 = new Promise((resolve) => {
      setTimeout(resolve, 100, 'foo');
    });

    expect.assertions(1);

    return Promise.xAll({
      a: promise1,
      b: promise2,
      c: promise3,
    }).then((values) => {
      expect(values).toEqual(results);
    });
  });

  it('异常流程处理', () => {
    const promise1 = Promise.resolve(3);
    const promise2 = 42;
    const promise3 = new Promise((resolve) => {
      setTimeout(resolve, 100, 'foo');
    });
    const promise4 = Promise.reject(new Error('error'));

    expect.assertions(1);

    return Promise.xAll({
      a: promise1,
      b: promise2,
      c: promise3,
      d: promise4,
    }).catch((error) => {
      expect(error).toEqual(new Error('error'));
    });
  });

  it('异常输入处理', () => {
    expect(() => {
      Promise.xAll(null);
    }).toThrow();
  });
});
