# Operator（操作符）

尽管 RxJS 的根基是 Observable，但最有用的还是它的操作符。操作符是允许复杂的异步代码以声明式的方式进行轻松组合的基础代码单元。操作符是 Observable 类型上的方法，比如 .map(...)、.filter(...)、.merge(...)，等等。当操作符被调用时，它们不会改变已经存在的 Observable 实例。相反，它们返回一个新的 Observable，它的 subscription 逻辑基于第一个 Observable 。

操作符是函数，它基于当前的 Observable 创建一个新的 Observable。这是一个无副作用的操作：前面的 Observable 保持不变。操作符本质上是一个纯函数 (pure function)，它接收一个 Observable 作为输入，并生成一个新的 Observable 作为输出。订阅输出 Observable 同样会订阅输入 Observable 。在下面的示例中，我们创建一个自定义操作符函数，它将从输入 Observable 接收的每个值都乘以 10：

```js
function multiplyByTen(input) {
  const output = Rx.Observable.create(function subscribe(observer) {
    input.subscribe({
      next: (v) => observer.next(10 * v),
      error: (err) => observer.error(err),
      complete: () => observer.complete(),
    });
  });
  return output;
}

const input = Rx.Observable.from([1, 2, 3, 4]);
const output = multiplyByTen(input);
output.subscribe((x) => console.log(x));
```

# 实例操作符 vs. 静态操作符

通常提到操作符时，我们指的是实例操作符，它是 Observable 实例上的方法。举例来说，如果上面的 multiplyByTen 是官方提供的实例操作符，它看起来大致是这个样子的：

```js
Rx.Observable.prototype.multiplyByTen = function multiplyByTen() {
  const input = this;
  return Rx.Observable.create(function subscribe(observer) {
    input.subscribe({
      next: (v) => observer.next(10 * v),
      error: (err) => observer.error(err),
      complete: () => observer.complete(),
    });
  });
};
```

注意，这里的 input Observable 不再是一个函数参数，它现在是 this 对象。下面是我们如何使用这样的实例运算符：

```js
const observable = Rx.Observable.from([1, 2, 3, 4]).multiplyByTen();

observable.subscribe((x) => console.log(x));
```

除了实例操作符，还有静态操作符，它们是直接附加到 Observable 类上的。静态操作符在内部不使用 this 关键字，而是完全依赖于它的参数。最常用的静态操作符类型是所谓的创建操作符。它们只接收非 Observable 参数，比如数字，然后创建一个新的 Observable，而不是将一个输入 Observable 转换为输出 Observable 。一个典型的静态操作符例子就是 interval 函数。它接收一个数字(非 Observable)作为参数，并生产一个 Observable 作为输出：

```js
const observable = Rx.Observable.interval(1000 /* 毫秒数 */);
```

## Marble diagrams (弹珠图)

要解释操作符是如何工作的，文字描述通常是不足以描述清楚的。许多操作符都是跟时间相关的，它们可能会以不同的方式延迟(delay)、取样(sample)、节流(throttle)或去抖动值(debonce)。图表通常是更适合的工具。弹珠图是操作符运行方式的视觉表示，其中包含输入 Obserable(s) (输入可能是多个 Observable )、操作符及其参数和输出 Observable 。

![弹珠图](https://s1.ax1x.com/2020/03/26/GSgSUA.png)

在弹珠图中，时间流向右边，图描述了在 Observable 执行中值(“弹珠”)是如何发出的。

# 操作符案例

## 控制流动

```js
// 输入 "hello world"
const input = Rx.Observable.fromEvent(document.querySelector("input"), "input");

// 过滤掉小于3个字符长度的目标值
input
  .filter((event) => event.target.value.length > 2)
  .map((event) => event.target.value)
  .subscribe((value) => console.log(value)); // "hel"

// 延迟事件
input
  .delay(200)
  .map((event) => event.target.value)
  .subscribe((value) => console.log(value)); // "h" -200ms-> "e" -200ms-> "l" ...

// 每200ms只能通过一个事件
input
  .throttleTime(200)
  .map((event) => event.target.value)
  .subscribe((value) => console.log(value)); // "h" -200ms-> "w"

// 停止输入后200ms方能通过最新的那个事件
input
  .debounceTime(200)
  .map((event) => event.target.value)
  .subscribe((value) => console.log(value)); // "o" -200ms-> "d"

// 在3次事件后停止事件流
input
  .take(3)
  .map((event) => event.target.value)
  .subscribe((value) => console.log(value)); // "hel"

// 直到其他 observable 触发事件才停止事件流
const stopStream = Rx.Observable.fromEvent(
  document.querySelector("button"),
  "click"
);
input
  .takeUntil(stopStream)
  .map((event) => event.target.value)
  .subscribe((value) => console.log(value)); // "hello" (点击才能看到)
```

## 产生值

```js
// 输入 "hello world"
const input = Rx.Observable.fromEvent(document.querySelector("input"), "input");

// 传递一个新的值
input
  .map((event) => event.target.value)
  .subscribe((value) => console.log(value)); // "h"

// 通过提取属性传递一个新的值
input.pluck("target", "value").subscribe((value) => console.log(value)); // "h"

// 传递之前的两个值
input
  .pluck("target", "value")
  .pairwise()
  .subscribe((value) => console.log(value)); // ["h", "he"]

// 只会通过唯一的值
input
  .pluck("data")
  .distinct()
  .subscribe((value) => console.log(value)); // "helo wrd"

// 不会传递重复的值
input
  .pluck("data")
  .distinctUntilChanged()
  .subscribe((value) => console.log(value)); // "helo world"
```
