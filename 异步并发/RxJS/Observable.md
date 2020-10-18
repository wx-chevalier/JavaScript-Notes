# Observable (可观察对象)

Observables 是多个值的惰性推送集合。当订阅下面代码中的 Observable 的时候会立即(同步地)推送值 1、2、3，然后 1 秒后会推送值 4，再然后是完成流：

```js
const observable = Rx.Observable.create(function (observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  setTimeout(() => {
    observer.next(4);
    observer.complete();
  }, 1000);
});
```

要调用 Observable 并看到这些值，我们需要订阅 Observable：

```js
console.log("just before subscribe");
observable.subscribe({
  next: (x) => console.log("got value " + x),
  error: (err) => console.error("something wrong occurred: " + err),
  complete: () => console.log("done"),
});
console.log("just after subscribe");
```

Observables 是使用 Rx.Observable.create 或创建操作符创建的，并使用观察者来订阅它，然后执行它并发送 next/error/complete 通知给观察者，而且执行可能会被清理。这四个方面全部编码在 Observables 实例中，但某些方面是与其他类型相关的，像 Observer (观察者) 和 Subscription (订阅)。

# 拉取 (Pull) vs. 推送 (Push)

拉取和推送是两种不同的协议，用来描述数据生产者 (Producer)如何与数据消费者 (Consumer)进行通信的。在拉取体系中，由消费者来决定何时从生产者那里接收数据。生产者本身不知道数据是何时交付到消费者手中的。每个 JavaScript 函数都是拉取体系。函数是数据的生产者，调用该函数的代码通过从函数调用中“取出”一个单个返回值来对该函数进行消费。ES2015 引入了 generator 函数和 iterators (`function*`)，这是另外一种类型的拉取体系。调用 iterator.next() 的代码是消费者，它会从 iterator(生产者) 那“取出”多个值。

在推送体系中，由生产者来决定何时把数据发送给消费者。消费者本身不知道何时会接收到数据。在当今的 JavaScript 世界中，Promises 是最常见的推送体系类型。Promise(生产者) 将一个解析过的值传递给已注册的回调函数(消费者)，但不同于函数的是，由 Promise 来决定何时把值“推送”给回调函数。RxJS 引入了 Observables，一个新的 JavaScript 推送体系。Observable 是多个值的生产者，并将值“推送”给观察者(消费者)。

- **Function** 是惰性的评估运算，调用时会同步地返回一个单一值。
- **Generator** 是惰性的评估运算，调用时会同步地返回零到(有可能的)无限多个值。
- **Promise** 是最终可能(或可能不)返回单个值的运算。
- **Observable** 是惰性的评估运算，它可以从它被调用的时刻起同步或异步地返回零到(有可能的)无限多个值。

# 创建 Observables

Rx.Observable.create 是 Observable 构造函数的别名，它接收一个参数：subscribe 函数。下面的示例创建了一个 Observable，它每隔一秒会向观察者发送字符串 'hi' 。

```ts
const observable = Rx.Observable.create(function subscribe(observer) {
  const id = setInterval(() => {
    observer.next("hi");
  }, 1000);
});
```

Observables 可以使用 create 来创建, 但通常我们使用所谓的创建操作符, 像 of、from、interval、等等。

```ts
// 来自一个或多个值
Rx.Observable.of("foo", "bar");

// 来自数组
Rx.Observable.from([1, 2, 3]);

// 来自事件
Rx.Observable.fromEvent(document.querySelector("button"), "click");

// 来自 Promise
Rx.Observable.fromPromise(fetch("/users"));

// 来自回调函数(最后一个参数得是回调函数，比如下面的 cb)
// fs.exists = (path, cb(exists))
const exists = Rx.Observable.bindCallback(fs.exists);
exists("file.txt").subscribe((exists) =>
  console.log("Does file exist?", exists)
);

// 来自回调函数(最后一个参数得是回调函数，比如下面的 cb)
// fs.rename = (pathA, pathB, cb(err, result))
const rename = Rx.Observable.bindNodeCallback(fs.rename);
rename("file.txt", "else.txt").subscribe(() => console.log("Renamed!"));
```

# 订阅 Observables

示例中的 Observable 对象 observable 可以订阅，像这样：

```js
observable.subscribe((x) => console.log(x));
```

observable.subscribe 和 `Observable.create(function subscribe(observer) {...})` 中的 subscribe 有着同样的名字，这并不是一个巧合。在库中，它们是不同的，但从实际出发，你可以认为在概念上它们是等同的。这表明 subscribe 调用在同一 Observable 的多个观察者之间是不共享的。当使用一个观察者调用 observable.subscribe 时，`Observable.create(function subscribe(observer) {...})` 中的 subscribe 函数只服务于给定的观察者。对 observable.subscribe 的每次调用都会触发针对给定观察者的独立设置。

这与像 addEventListener / removeEventListener 这样的事件处理方法 API 是完全不同的。使用 observable.subscribe，在 Observable 中不会将给定的观察者注册为监听器。Observable 甚至不会去维护一个附加的观察者列表。

# 执行 Observables

Observable.create(function subscribe(observer) {...}) 中...的代码表示 “Observable 执行”，它是惰性运算，只有在每个观察者订阅后才会执行。随着时间的推移，执行会以同步或异步的方式产生多个值。Observable 执行可以传递三种类型的值：

- "Next" 通知：发送一个值，比如数字、字符串、对象，等等。
- "Error" 通知：发送一个 JavaScript 错误 或 异常。
- "Complete" 通知：不再发送任何值。

"Next" 通知是最重要，也是最常见的类型：它们表示传递给观察者的实际数据。"Error" 和 "Complete" 通知可能只会在 Observable 执行期间发生一次，并且只会执行其中的一个。

下面是 Observable 执行的示例，它发送了三个 "Next" 通知，然后是 "Complete" 通知：

```js
const observable = Rx.Observable.create(function subscribe(observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
});
```

Observable 严格遵守自身的规约，所以下面的代码不会发送 "Next" 通知 `4`：

```js
const observable = Rx.Observable.create(function subscribe(observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
  observer.next(4); // 因为违反规约，所以不会发送
});
```

在 `subscribe` 中用 `try`/`catch` 代码块来包裹任意代码是个不错的主意，如果捕获到异常的话，会发送 "Error" 通知：

```js
const observable = Rx.Observable.create(function subscribe(observer) {
  try {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
  } catch (err) {
    observer.error(err); // 如果捕获到异常会发送一个错误
  }
});
```

# 清理 Observable 执行

因为 Observable 执行可能会是无限的，并且观察者通常希望能在有限的时间内中止执行，所以我们需要一个 API 来取消执行。因为每个执行都是其对应观察者专属的，一旦观察者完成接收值，它必须要一种方法来停止执行，以避免浪费计算能力或内存资源。当调用了 observable.subscribe ，观察者会被附加到新创建的 Observable 执行中。这个调用还返回一个对象，即 Subscription (订阅)：

```ts
const subscription = observable.subscribe((x) => console.log(x));
```

Subscription 表示进行中的执行，它有最小化的 API 以允许你取消执行。使用 subscription.unsubscribe() 你可以取消进行中的执行：

```ts
const observable = Rx.Observable.from([10, 20, 30]);
const subscription = observable.subscribe((x) => console.log(x));
// 稍后：
subscription.unsubscribe();
```

当我们使用 create() 方法创建 Observable 时，Observable 必须定义如何清理执行的资源。你可以通过在 function subscribe() 中返回一个自定义的 unsubscribe 函数。举例来说，这是我们如何清理使用了 setInterval 的 interval 执行集合：

```js
const observable = Rx.Observable.create(function subscribe(observer) {
  // 追踪 interval 资源
  const intervalID = setInterval(() => {
    observer.next("hi");
  }, 1000);

  // 提供取消和清理 interval 资源的方法
  return function unsubscribe() {
    clearInterval(intervalID);
  };
});
```

正如 `observable.subscribe` 类似于 `Observable.create(function subscribe() {...})`，从 `subscribe` 返回的 `unsubscribe` 在概念上也等同于 `subscription.unsubscribe`。事实上，如果我们抛开围绕这些概念的 ReactiveX 类型，保留下来的只是相当简单的 JavaScript 。

```js
function subscribe(observer) {
  const intervalID = setInterval(() => {
    observer.next("hi");
  }, 1000);

  return function unsubscribe() {
    clearInterval(intervalID);
  };
}

const unsubscribe = subscribe({ next: (x) => console.log(x) });

// 稍后：
unsubscribe(); // 清理资源
```

为什么我们要使用像 Observable、Observer 和 Subscription 这样的 Rx 类型？原因是保证代码的安全性(比如 Observable 规约)和操作符的可组合性。
