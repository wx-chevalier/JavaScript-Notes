![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/6/1/fetch-logo-promo.gif)

# x-fetch: Extreme and Fluent Wrapper for fetch

在[第一版本的 Fluent Fetcher 中](https://parg.co/bXJ)，笔者希望将所有的功能包含在单一的 FluentFetcher 类内，结果发现整个文件冗长而丑陋；在团队内部尝试推广时也无人愿用，包括自己过了一段时间再拾起这个库也觉得很棘手。在编写 declarative-crawler 的时候，笔者又用到了 fluent-fetcher，看着如乱麻般的代码，我不由沉思，为什么当时会去封装这个库？为什么不直接使用 fetch，而是自找麻烦多造一层轮子。就如笔者在 [2016-我的前端之路:工具化与工程化](https://zhuanlan.zhihu.com/p/24575395)一文中介绍的，框架本身是对于复用代码的提取或者功能的扩展，其会具有一定的内建复杂度。如果内建复杂度超过了业务应用本身的复杂度，那么引入框架就不免多此一举了。而网络请求则是绝大部分客户端应用不可或缺的一部分，纵观多个项目，我们也可以提炼出很多的公共代码；譬如公共的域名、请求头、认证等配置代码，有时候需要添加扩展功能：譬如重试、超时返回、缓存、Mock 等等。笔者构建 Fluent Fetcher 的初衷即是希望能够简化网络请求的步骤，将原生 fetch 中偏声明式的构造流程以流式方法调用的方式提供出来，并且为原有的执行函数添加部分功能扩展。

那么之前框架的问题在于：

* 模糊的文档，很多参数的含义、用法包括可用的接口类型都未讲清楚；
* 接口的不一致与不直观，默认参数，是使用对象解构(opt = {})还是函数的默认参数(arg1, arg2 = 2)；
* 过多的潜在抽象漏洞，将 Error 对象封装了起来，导致使用者很难直观地发现错误，并且也不便于使用者进行个性化定制；
* 模块独立性的缺乏，很多的项目都希望能提供尽可能多的功能，但是这本身也会带来一定的风险，同时会导致最终打包生成的包体大小的增长。

好的代码，好的 API 设计确实应该如白居易的诗，浅显易懂而又韵味悠长，没有人有义务透过你邋遢的外表去发现你美丽的心灵。开源项目本身也意味着一种责任，如果是单纯地为了炫技而提升了代码的复杂度却是得不偿失。笔者认为最理想的情况是使用任何第三方框架之前都能对其源代码有所了解，像 React、Spring Boot、TensorFlow 这样比较复杂的库，我们可以慢慢地拨开它的面纱。而对于一些相对小巧的工具库，出于对自己负责、对团队负责的态度，在引入之前还是要了解下它们的源码组成，了解有哪些文档中没有提及的功能或者潜在风险。笔者在编写 Fluent Fetcher 的过程中也参考了 OkHttp、super-agent、request 等流行的网络请求库。

# 基本使用

V2 版本中的 Fluent Fetcher 中，最核心的设计变化在于将请求构建与请求执行剥离了开来。RequestBuilder 提供了构造器模式的接口，使用者首先通过 RequestBuilder 构建请求地址与配置，该配置也就是 fetch 支持的标准配置项；使用者也可以复用 RequestBuilder 中定义的非请求体相关的公共配置信息。而 execute 函数则负责执行请求，并且返回经过扩展的 Promise 对象。直接使用 npm / yarn 安装即可：

```
npm install fluent-fetcher

or

yarn add fluent-fetcher
```

## 创建请求

基础的 GET 请求构造方式如下：

```javascript
import { RequestBuilder } from "../src/index.js";

test("构建完整跨域缓存请求", () => {
  let { url, option }: RequestType = new RequestBuilder({
    scheme: "https",
    host: "api.com",
    encoding: "utf-8"
  })
    .get("/user")
    .cors()
    .cookie("*")
    .cache("no-cache")
    .build({
      queryParam: 1,
      b: "c"
    });

  chaiExpect(url).to.equal("https://api.com/user?queryParam=1&b=c");

  expect(option).toHaveProperty("cache", "no-cache");

  expect(option).toHaveProperty("credentials", "include");
});
```

RequestBuilder 的构造函数支持传入三个参数：

```javascript
   * @param scheme http 或者 https
   * @param host 请求的域名
   * @param encoding 编码方式,常用的为 utf8 或者 gbk
```

然后我们可以使用 header 函数设置请求头，使用 get / post / put / delete / del 等方法进行不同的请求方式与请求体设置；对于请求体的设置是放置在请求方法函数的第二与第三个参数中：

```javascript
// 第二个参数传入请求体
// 第三个参数传入编码方式，默认为 raw json
post("/user", { a: 1 }, "x-www-form-urlencoded");
```

最后我们调用 `build` 函数进行请求构建，`build` 函数会返回请求地址与请求配置；此外 `build` 函数还会重置内部的请求路径与请求体。鉴于  Fluent Fetch 底层使用了 node-fetch，因此 `build` 返回的 `option` 对象在 Node 环境下仅支持以下属性与扩展属性：

```javascript
{
	// Fetch 标准定义的支持属性
	method: 'GET',
	headers: {},        // request headers. format is the identical to that accepted by the Headers constructor (see below)
	body: null,         // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
	redirect: 'follow', // set to `manual` to extract redirect headers, `error` to reject redirect

	// node-fetch 扩展支持属性
	follow: 20,         // maximum redirect count. 0 to not follow redirect
	timeout: 0,         // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies)
	compress: true,     // support gzip/deflate content encoding. false to disable
	size: 0,            // maximum response body size in bytes. 0 to disable
	agent: null         // http(s).Agent instance, allows custom proxy, certificate etc.
}
```

此外，node-fetch 默认请求头设置：

| Header            | Value                                                    |
| ----------------- | -------------------------------------------------------- |
| `Accept-Encoding` | `gzip,deflate` _(when options.compress === true)_        |
| `Accept`          | `*/*`                                                    |
| `Connection`      | `close` _(when no options.agent is present)_             |
| `Content-Length`  | _(automatically calculated, if possible)_                |
| `User-Agent`      | `node-fetch/1.0 (+https://github.com/bitinn/node-fetch)` |

## 请求执行

`execute` 函数的说明为：

```
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
  acceptType: "json" | "text" | "blob" = "json",
  strategy: strategyType = {}
): Promise<any>{}

type strategyType = {
  // 是否需要添加进度监听回调，常用于下载
  onProgress: (progress: number) => {},

  // 用于 await 情况下的 timeout 参数
  timeout: number
};
```

### 引入合适的请求体

默认的浏览器与 Node 环境下我们直接从项目的根入口引入文件即可：

```
import {execute, RequestBuilder} from "../../src/index.js";
```

默认情况下，其会执行 `require("isomorphic-fetch");` ，而在 React Native 情况下，鉴于其自有 fetch 对象，因此就不需要动态注入。譬如笔者在[CoderReader](https://parg.co/bXV) 中 [获取 HackerNews 数据](https://parg.co/bX8)时，就需要引入对应的入口文件

```javascript
import { RequestBuilder, execute } from "fluent-fetcher/dist/index.rn";
```

而在部分情况下我们需要以 Jsonp 方式发起请求（仅支持 GET 请求），就需要引入  对应的请求体：

```javascript
import { RequestBuilder, execute } from "fluent-fetcher/dist/index.jsonp";
```

引入之后我们即可以正常发起请求，对于不同的请求类型与请求体，请求执行的方式是一致的：

```
test("测试基本 GET 请求", async () => {
  const { url: getUrl, option: getOption } = requestBuilder
    .get("/posts")
    .build();

  let posts = await execute(getUrl, getOption);

  expectChai(posts).to.have.length(100);
});
```

需要注意的是，部分情况下在 Node 中进行 HTTPS 请求时会报如下异常：

```javascript
(node:33875) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): FetchError: request to https://test.api.truelore.cn/users?token=144d3e0a-7abb-4b21-9dcb-57d477a710bd failed, reason: unable to verify the first certificate
(node:33875) DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

我们需要动态设置如下的环境变量：

```javascript
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
```

### 自动脚本插入

有时候我们需要自动地获取到脚本然后插入到界面中，此时就可以使用 `executeAndInject` 函数，其往往用于异步加载脚本或者样式类的情况：

```
import { executeAndInject } from "../../src/index";

let texts = await executeAndInject([
  "https://cdn.jsdelivr.net/fontawesome/4.7.0/css/font-awesome.min.css"
]);
```

笔者在 [create-react-boilerplate](https://github.com/wxyyxc1992/create-react-boilerplate) 项目提供的性能优化模式中也应用了该函数，在 React 组件中我们可以在 `componentDidMount` 回调中使用该函数来动态加载外部脚本：

```
// @flow
import React, { Component } from "react";
import { message, Spin } from "antd";
import { executeAndInject } from "fluent-fetcher";

/**
 * @function 执行外部脚本加载工作
 */
export default class ExternalDependedComponent extends Component {
  state = {
    loaded: false
  };

  async componentDidMount() {
    await executeAndInject([
      "https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/css/swiper.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/js/swiper.min.js"
    ]);

    message.success("异步 Swiper 脚本加载完毕！");

    this.setState({
      loaded: true
    });
  }

  render() {
    return (
      <section className="ExternalDependedComponent__container">
        {this.state.loaded
          ? <div style={{ color: "white" }}>
              <h1 style={{ position: "absolute" }}>Swiper</h1>
              <p style={{ position: "absolute", top: "50px" }}>
                Swiper 加载完毕，现在你可以在全局对象中使用 Swiper!
              </p>
              <img
                height="504px"
                width="320px"
                src="http://img5.cache.netease.com/photo/0031/2014-09-20/A6K9J0G94UUJ0031.jpg"
                alt=""
              />
            </div>
          : <div>
              <Spin size="large" />
            </div>}
      </section>
    );
  }
}
```

### 代理

有时候我们需要动态设置以代理方式执行请求，这里即动态地为 RequestBuilder 生成的请求配置添加 `agent` 属性即可：

```javascript
const HttpsProxyAgent = require("https-proxy-agent");

const requestBuilder = new RequestBuilder({
scheme: "http",
host: "jsonplaceholder.typicode.com"
});

const { url: getUrl, option: getOption } = requestBuilder
.get("/posts")
.pathSegment("1")
.build();

getOption.agent = new HttpsProxyAgent("http://114.232.81.95:35293");

let post = await execute(getUrl, getOption,"text");
```

# 扩展策略

## 中断与超时

`execute` 函数在执行基础的请求之外还回为 fetch 返回的 Promise 添加中断与超时地功能，需要注意的是如果以 Async/Await 方式编写异步代码则需要将 timeout 超时参数以函数参数方式传入 ；否则可以以属性方式设置：

```
describe("策略测试", () => {
  test("测试中断", done => {
    let fnResolve = jest.fn();
    let fnReject = jest.fn();

    let promise = execute("https://jsonplaceholder.typicode.com");

    promise.then(fnResolve, fnReject);

    // 撤销该请求
    promise.abort();

    // 异步验证
    setTimeout(() => {
      // fn 不应该被调用
      expect(fnResolve).not.toHaveBeenCalled();
      expect(fnReject).toHaveBeenCalled();
      done();
    }, 500);
  });

  test("测试超时", done => {
    let fnResolve = jest.fn();
    let fnReject = jest.fn();

    let promise = execute("https://jsonplaceholder.typicode.com");

    promise.then(fnResolve, fnReject);

    // 设置超时
    promise.timeout = 10;

    // 异步验证
    setTimeout(() => {
      // fn 不应该被调用
      expect(fnResolve).not.toHaveBeenCalled();
      expect(fnReject).toHaveBeenCalled();
      done();
    }, 500);
  });

  test("使用 await 下测试超时", async done => {
    try {
      await execute("https://jsonplaceholder.typicode.com", {}, "json", {
        timeout: 10
      });
    } catch (e) {
      expectChai(e.message).to.equal("Abort or Timeout");
    } finally {
      done();
    }
  });
});
```

## 进度反馈

```javascript
function consume(reader) {
  let total = 0;
  return new Promise((resolve, reject) => {
    function pump() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            resolve();
            return;
          }
          total += value.byteLength;
          log(`received ${value.byteLength} bytes (${total} bytes in total)`);
          pump();
        })
        .catch(reject);
    }
    pump();
  });
}

// 执行数据抓取操作
fetch("/music/pk/altes-kamuffel.flac")
  .then(res => consume(res.body.getReader()))
  .then(() =>
    log("consumed the entire body without keeping the whole thing in memory!")
  )
  .catch(e => log("something went wrong: " + e));
```

## Pipe

`execute` 还支持动态地将抓取到的数据传入到其他处理管道中，譬如在 Node.js 中完成图片抓取之后可以将其保存到文件系统中；如果是浏览器环境下则需要动态传入某个 img 标签的 ID，`execute` 会在图片抓取完毕后动态地设置图片内容：

```js
describe("Pipe 测试", () => {
  test("测试图片下载", async () => {
    let promise = execute(
      "https://assets-cdn.github.com/images/modules/logos_page/Octocat.png",
      {},
      "blob"
    ).pipe("/tmp/Octocat.png", require("fs"));
  });
});
```

# About

## Acknowledge

* [r2](https://github.com/mikeal/r2/tree/master): HTTP client. Spiritual successor to request.

* [wretch](https://github.com/elbywan/wretch)

## Contribution & RoadMap

如果我们需要进行本地调试，则可以在当前模块目录下使用 `npm link` 来创建本地链接：

```
$ cd package-name
$ npm link
```

然后在使用该模块的目录下同样使用 `npm link` 来关联目标项目：

```
$ cd project
$ npm link package-name
```
