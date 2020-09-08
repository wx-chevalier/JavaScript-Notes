/* eslint-disable no-extend-native */

/**
 * Description: 增强版本的 Promise.all，支持数组与对象方式。如果传入的是数组形式的 promises，则返回结果数组；如果传入 {a: Promise} 则返回对象。
 * @param {Array|Object} promises
 * @return {Promise<any>} 新的 Promise 对象
 */
Promise.xAll = promises => {
  // 在这里进行入参校验，如果参数非 object 则直接抛出异常
  if (typeof promises !== 'object' || promises === null) {
    throw new Error('Invalid Params');
  }

  // 返回构建好的 Promise 对象
  return new Promise((resolve, reject) => {
    // 计数器，判断剩余的 Promise 数目
    let result;
    let leftPromiseSize;

    const resolveAll = () => {
      leftPromiseSize -= 1;
      if (leftPromiseSize === 0) {
        resolve(result);
      }
    };

    /** 处理 Promise，使用回调函数填充数据 */
    const handleProcess = (promise, cb) => {
      if (!(promise instanceof Promise)) {
        cb(promise);
        resolveAll();
      } else {
        promise
          .then(data => {
            cb(data);

            resolveAll();
          })
          .catch(err => {
            reject(err);
          });
      }
    };

    // 判断是否为数组，还是对象
    if (Array.isArray(promises)) {
      result = [];
      leftPromiseSize = promises.length;

      // 遍历激活所有的 Promise
      promises.forEach((promise, i) => {
        handleProcess(promise, data => {
          result[i] = data;
        });
      });
    } else {
      result = {};
      leftPromiseSize = Object.keys(promises).length;

      Object.keys(promises).forEach(key => {
        handleProcess(promises[key], data => {
          result[key] = data;
        });
      });
    }

    // 如果 promises 为空，则在这里返回最后的空结果
    if (leftPromiseSize === 0) {
      resolve(result);
    }
  });
};
