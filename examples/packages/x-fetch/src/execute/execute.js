// @flow

// 判断是否为 Node 环境
const isNode: boolean = typeof process !== 'undefined';

type strategyType = {
  // 是否需要添加进度监听回调，常用于下载
  onProgress: (progress: number) => {},

  // 用于 await 情况下的 timeout 参数
  timeout: number
};

let strategyInstance;

/**
 * Description 根据传入的请求配置发起请求并进行预处理
 * @param url
 * @param option
 * @param {*} acceptType json | text | blob
 * @param strategy
 */
export default function execute(
  url: string,
  option: any = {},
  acceptType: 'json' | 'text' | 'blob' = 'json',
  strategy: strategyType = {}
): Promise<any> {
  if (!url) {
    throw new Error('地址未定义');
  }

  let promise: Promise<any>;

  strategyInstance = strategy;

  if (strategy.Jsonp) {
    // Jsonp 只能是 Get 请求，并且不能带函数
    promise = fetch(url);
  } else {
    // 这里判断是否为 Node 环境，是 Node 环境则设置环境变量
    if (typeof process !== 'undefined') {
      // 避免 HTTPS 错误
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    //构建fetch请求
    promise = fetch(url, option);
  }

  // 添加基本的处理逻辑
  promise = promise
    .then(
      response => _checkStatus(response, acceptType),
      error => {
        throw error;
      }
    )
    .then(
      response => {
        // 根据不同的数据类型启用不同的解析方式
        if (acceptType === 'json') {
          return _parseJSON(response);
        } else if (acceptType === 'blob') {
          return _parseBlob(response);
        } else {
          return _parseText(response);
        }
      },
      error => {
        throw error;
      }
    );

  // 以高阶函数的方式封装 Promise 对象

  return _decorate(promise);
}

/**
 * @function 检测返回值的状态
 * @param response
 * @param acceptType
 * @returns {*}
 */
function _checkStatus(response, acceptType) {
  if (
    (response.status >= 200 && response.status < 300) ||
    response.status === 0
  ) {
    return response;
  } else {
    // 封装错误对象
    let error = new Error(
      JSON.stringify({
        status: response.status,
        statusText: response.statusText
      })
    );

    error.response = response;

    throw error;
  }
}

/**
 * @function 解析返回值中的Response为JSON形式
 * @param response
 * @returns {*}
 */
function _parseJSON(response) {
  if (!!response) {
    return response.json();
  } else {
    return {};
  }
}

/**
 * @function 解析TEXT性质的返回
 * @param response
 * @returns {*}
 */
function _parseText(response: Response): Promise<string> | string {
  if (!!response) {
    return response.text();
  } else {
    return '';
  }
}

/**
 * @function 解析二进制流性质的返回
 * @param response
 * @returns {*}
 */
function _parseBlob(response: Response): Promise<string> | null {
  if (!!response) {
    if (isNode) {
      return response;
    } else {
      return response.blob();
    }
  } else {
    return null;
  }
}

/**
 * @function 将原始的 Promise 进行封装
 * @private
 * @param initialpromise
 */
function _decorate(initialpromise: Promise<any>): Promise<any> {
  let abortFunction;

  // 默认 60 秒过时
  let timeout = 0;

  let abortablePromise = new Promise((resolve, reject) => {
    // 闭包方式传递对象
    abortFunction = () => {
      reject(new Error('Abort or Timeout'));
    };
  });

  let promise = Promise.race([initialpromise, abortablePromise]);

  // 挂载放弃函数
  promise.abort = abortFunction;

  // 挂载 pipe 函数
  /**
   * @param idOrWriteStream
   * @param fs 如果是 Node 环境，需要额外传入 fs 对象
   * @returns {Promise.<TResult>}
   */
  promise.pipe = (idOrWriteStream: any, fs) => {
    return promise.then(
      resOrBlobData => {
        // 判断是否为 Node 环境
        if (!isNode) {
          document.querySelector(idOrWriteStream).src = URL.createObjectURL(
            resOrBlobData
          );
        } else {
          if (!fs) {
            console.error('fs is null!');
            return;
          }

          // 如果为 Node 环境，则写入到磁盘中
          let dest = fs.createWriteStream(idOrWriteStream);

          // 将数据利用 pipe 写入到文件中
          resOrBlobData.body.pipe(dest);
        }
      },
      error => {
        throw error;
      }
    );
  };

  // 定义 timeout 对象
  Object.defineProperty(promise, 'timeout', {
    set: function(ts) {
      if ((ts = +ts)) {
        timeout = ts;
        setTimeout(abortFunction, ts);
      }
    },
    get: function() {
      return timeout;
    }
  });

  if (strategyInstance.hasOwnProperty('timeout')) {
    promise.timeout = strategyInstance.timeout;
  }

  return promise;
}
