// @flow

require("isomorphic-fetch");

// 存放全局已经加载好的脚本信息
const promises = {};

const isNode: boolean = typeof process !== "undefined";

/**
 * @function 从远端抓取
 * 如果是在 DOM 环境下则插入到 header 中，否则将抓取到的内容直接返回给调用者
 * @param urls
 * @refer https://github.com/jhabdas/fetch-inject/blob/master/src/fetch-inject.js
 */
export default function executeAndInject(urls: [string]): Promise<Array<any>> {
  if (!(urls && Array.isArray(urls)))
    return Promise.reject(new Error("`urls` must be an array"));

  // 如果是 Node，则直接返回结果
  if (isNode) {
    return Promise.all(
      urls.map((url: string) => {
        // 如果是 Node 环境，则直接返回文本内容
        return fetch(url).then(res => res.text());
      })
    );
  }

  // 否则直接抓取并且进行插入操作
  return Promise.all(urls.map(loadAsset));
}

/**
 * @function 用于加载Script脚本
 * @param src
 * @returns {*}
 */
function loadAsset(src) {
  //判断该脚本是否被加载过
  if (promises[src]) {
    return promises[src];
  }

  //构造一个Promise对象
  let promise = (promises[src] = new Promise(resolve => {
    //创建一个元素
    let el;

    // 判断是否为脚本
    let isScript = typeof src === "string" && src.indexOf(".js") > -1;

    if (isScript) {
      el = document.createElement("script");
    } else {
      el = document.createElement("link");

      el.rel = "stylesheet";

      el.href = src;

      el.media = "only x";
    }

    let loaded = false;

    //设置加载完成的回调事件
    el.onload = el.onreadystatechange = () => {
      //防止重复加载
      if (
        (el.readyState &&
          el.readyState !== "complete" &&
          el.readyState !== "loaded") ||
        loaded
      ) {
        return false;
      }

      //加载完成后将该脚本的onload设置为null
      el.onload = el.onreadystatechange = null;

      loaded = true;

      resolve();
    };

    if (isScript) {
      el.async = true;

      el.src = src;
    } else {
      el.media = "all";
    }

    let head = document.getElementsByTagName("head")[0];

    head.insertBefore(el, head.firstChild);
  }));

  return promise;
}
