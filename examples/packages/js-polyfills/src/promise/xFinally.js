/* eslint-disable no-extend-native */

/**
 * Description finally 函数，用于捕获全部流程
 * @param callback finally 中传入的回调函数
 * @return {PromiseLike<T> | Promise<T>}
 */
Promise.prototype.xFinally = function (callback) {
  return this.then(
    (data) => {
      return Promise.resolve(callback()).then(() => {
        return data;
      });
    },
    (error) => {
      return Promise.resolve(callback()).then(() => {
        throw error;
      });
    }
  );
};
