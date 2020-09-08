/**
 * 实现 co 函数
 *
 * function* gen(){
 *  const r = yield Promise.resolve(true);
 *  return r;
 * }
 *
 * co(gen).then((r)=>{
 *  console.log(r)
 * })
 */
export default function co(gen) {
  return new Promise((resolve, reject) => {
    const iter = gen();
    const n = iter.next();

    const handleNext = next => {
      if (next.done) {
        resolve(next.value);
        return;
      }

      if (next.value instanceof Promise) {
        next.value.then(
          r => {
            next = iter.next(r);
            handleNext(next);
          },
          err => {
            reject(err);
          }
        );
      } else {
        handleNext(iter.next(next.value));
      }
    };
    handleNext(n);
  });
}
