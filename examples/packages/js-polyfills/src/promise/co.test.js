import co from './co';

describe('Promise.xFinally', () => {
  it('正常流程校验', () => {
    function* cGen() {
      let r = yield Promise.resolve(1);
      r = yield Promise.resolve(r + 1);
      r = yield r + 1;
      return r;
    }

    co(cGen).then(r => {
      expect(r).toEqual(3);
    });
  });
});
